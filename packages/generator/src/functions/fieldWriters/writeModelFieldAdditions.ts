/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { WriteFieldOptions } from '../../types';
import { ExtendedDMMFField } from '../../classes'
import _ from 'radash';

/**
 * Writes all relevant additional zod modifiers like`.nullish().array().optional()` to a field
 * 额外增加了 `.openapi()`
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
      `.openapi(${JSON.stringify(writeFieldOpenApi(field))})`,
    )
    .write(`,`)
    .newLine();
};


export function writeFieldOpenApi(field: ExtendedDMMFField) {
  if (field.isList === false && field.relationName  /* references */) {
    return {
      ...{
        name: field.name,
        display_name: _.title(field.name),
        model_name: field.type,
        foreign_key: (field.relationFromFields && field.relationFromFields[0]) ? field.relationFromFields[0] : null,
        primary_key: (field.relationToFields && field.relationToFields[0]) ? field.relationToFields[0] : null,
        reference_type: field.isUnique ? 'has_one' : 'belongs_to',
      },
      ...field.openapi,
      references: true,
    }
  }

  if (field.isList && field.relationName /* associations */) {
    return {
      ...{
        name: field.name,
        display_name: _.title(field.name),
        slug: _.snake(field.name),
        model_name: field.type,
        visible: true,
      },
      ...field.openapi,
      associations: true, /* 方便 openapi -> ui schema */
    }
  }

  return {
    ...{
      name: field.name,
      display_name: _.title(field.name),
      column_source: 'table',
    },
    ...field.openapi,
  }
}
