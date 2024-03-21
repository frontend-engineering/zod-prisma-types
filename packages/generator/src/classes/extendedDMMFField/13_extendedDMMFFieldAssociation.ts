import { DMMF } from '@prisma/generator-helper';

import { GeneratorConfig } from '../../schemas';
import { ExtendedDMMFFieldZodType } from './12_extendedDMMFFieldZodType';
import { ExtendedDMMFDatamodel } from '../extendedDMMFDatamodel';

/**
 * 新增扩展类，主要处理 associations 涉及多个 models 的情况
 *
 */
export class ExtendedDMMFFieldAssociation extends ExtendedDMMFFieldZodType {
  /**
   * optional 是为了兼容 test spec
   */
  readonly datamodel?: ExtendedDMMFDatamodel;
  readonly relatedField?: DMMF.Field;

  constructor(
    field: DMMF.Field,
    generatorConfig: GeneratorConfig,
    modelName: string,
    models?: DMMF.Model[],
  ) {
    super(field, generatorConfig, modelName);
    if (field.relationName) {
      if (
        field.isList /* association */ ||
        /* has_one */ (field.relationToFields &&
          field.relationToFields.length === 0)
      ) {
        this.relatedField = this._setRelatedField(field, modelName, models);
      }
    }
  }

  _setRelatedField(
    field: DMMF.Field,
    modelName: string,
    models?: DMMF.Model[],
  ) {
    if (!models)
      throw new Error(`No parameter datamodel, ${modelName}#${field.name}`);
    const relatedModel = models.find((m) => m.name === field.type);
    if (!relatedModel)
      throw new Error(`No related model, ${modelName}#${field.name}`);
    const relatedField = relatedModel.fields.find(
      (f) => f.relationName === field.relationName,
    );
    if (!relatedField)
      throw new Error(`No related field, ${modelName}#${field.name}`);
    return relatedField;
  }
}
