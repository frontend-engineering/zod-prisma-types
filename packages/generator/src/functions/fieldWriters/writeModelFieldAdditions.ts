/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { WriteFieldOptions } from '../../types';
import { ExtendedDMMFField } from '../../classes';
import _ from 'radash';
import { writeOpenApi } from '../../utils';
import * as util from 'util';

/**
 * Writes all relevant additional zod modifiers like`.nullish().array().optional()` to a field
 * add `.openapi()`
 */
export const writeFieldAdditions = ({
  writer,
  field,
  writeOptionalDefaults = false,
}: WriteFieldOptions) => {
  const { writeNullishInModelTypes } = field.generatorConfig;

  let openapiMethod: 'association' | 'reference' | 'column';
  if (field.relationName) {
    if (field.isList) {
      openapiMethod = 'association';
    } else {
      openapiMethod = 'reference';
    }
  } else {
    openapiMethod = 'column';
  }

  writer
    .conditionalWrite(field.isList, `.array()`)
    .conditionalWrite(
      !!field.zodArrayValidatorString,
      field.zodArrayValidatorString!,
    )
    .conditionalWrite(
      field.isNullable &&
        !field.isOptionalOnDefaultValue &&
        !writeNullishInModelTypes,
      `.nullable()`,
    )
    .conditionalWrite(
      field.isNullable &&
        !field.isOptionalOnDefaultValue &&
        writeNullishInModelTypes,
      `.nullish()`,
    )
    .conditionalWrite(
      writeOptionalDefaults && field.isOptionalOnDefaultValue,
      `.optional()`,
    )
    .conditionalWrite(
      !!field.openapi,
      `.${openapiMethod}(${util.inspect(writeFieldOpenApi(field))})`,
    )
    .write(`,`)
    .newLine();
};

export function writeFieldOpenApi(field: ExtendedDMMFField) {
  if (!field.openapi) return {};
  const openapi = Object.entries(_.group(field.openapi, (f) => f.type)).reduce(
    (acc, cur) => {
      const [key, value] = cur;
      acc = {
        ...acc,
        ...writeOpenApi([key, value!]),
      };
      return acc;
    },
    {},
  );
  if (field.relationName) {
    if (field.isList /* associations */) {
      return {
        ...{
          display_name: _.title(field.name),
          slug: _.snake(field.name),
          model_name: field.type,
          visible: true,
          foreign_key:
            field.relatedField &&
            field.relatedField.relationFromFields &&
            field.relatedField.relationFromFields[0]
              ? field.relatedField.relationFromFields[0]
              : null,
          primary_key:
            field.relatedField &&
            field.relatedField.relationToFields &&
            field.relatedField.relationToFields[0]
              ? field.relatedField.relationToFields[0]
              : null,
        },
        ...openapi,
      };
    }
    /* references */
    return {
      ...{
        display_name: _.title(field.name),
        model_name: field.type,
        foreign_key:
          field.relationFromFields?.[0] ||
          field.relatedField?.relationFromFields?.[0] ||
          null,
        primary_key:
          field.relationToFields?.[0] ||
          field.relatedField?.relationToFields?.[0] ||
          null,
        reference_type: field.relatedField ? 'has_one' : 'belongs_to',
      },
      ...openapi,
    };
  }

  return {
    ...{
      display_name: _.title(field.name),
      column_type: field.type,
    },
    ...openapi,
  };
}
