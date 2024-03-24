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
      `.openapi(${util.inspect(writeFieldOpenApi(field))})`,
    );

  Object.entries(_.group(field.openapi, (f) => f.type)).forEach(
    ([key, value]) => {
      writer.conditionalWrite(
        key !== '' && Array.isArray(value) && value.length > 0,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        `.openapi(${util.inspect(writeOpenApi([key, value!]))})`,
      );
    },
  );

  writer.write(`,`).newLine();
};

export function writeFieldOpenApi(field: ExtendedDMMFField) {
  const openapi = writeOpenApi([
    '',
    field.openapi.filter((f) => f.type === ''),
  ]);
  if (field.relationName) {
    if (field.isList /* associations */) {
      return {
        ...{
          key_type: 'association',
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
        key_type: 'reference',
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
      key_type: 'column',
      display_name: _.title(field.name),
    },
    ...openapi,
  };
}
