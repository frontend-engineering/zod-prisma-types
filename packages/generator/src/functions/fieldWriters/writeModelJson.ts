import { WriteFieldOptions } from '../../types';
import { writeFieldAdditions } from './writeModelFieldAdditions';

export const writeJson = ({ writer, field }: WriteFieldOptions) => {
  writer
    .conditionalWrite(field.omitInModel(), '// omitted: ')
    .write(`${field.formattedNames.original}: `)
    // .conditionalWrite(field.isRequired, `InputJsonValue`)
    // .conditionalWrite(!field.isRequired, `NullableJsonValue`)
    .write(`z.any()`)
    .conditionalWrite(field.isList, `.array()`)
    .conditionalWrite(!field.isRequired, `.optional()`);

  writeFieldAdditions({ writer, field });
};
