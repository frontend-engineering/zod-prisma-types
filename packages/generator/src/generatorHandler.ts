const { generatorHandler } = require('@prisma/generator-helper');
const { z } = require('zod');

const { DirectoryHelper, ExtendedDMMF, generateMultipleFiles, generateSingleFile, skipGenerator, parseGeneratorConfig } = require('./generator.bundle.js');

/////////////////////////////////////////
// SCHEMAS
/////////////////////////////////////////

const outputSchema = z.object({
  fromEnvVar: z.string().nullable(),
  value: z.string({ required_error: 'No output path specified' }),
});

/////////////////////////////////////////
// GENERATOR
/////////////////////////////////////////

generatorHandler({
  onManifest: () => {
    return {
      defaultOutput: './generated/zod',
      prettyName: 'Zod Prisma Types',
    };
  },
  // @ts-expect-error
  onGenerate: async (generatorOptions) => {
    if (skipGenerator()) return;

    // get all config options from schema.prisma
    const config = parseGeneratorConfig(generatorOptions);

    // validate that the output path is present
    const output = outputSchema.parse(generatorOptions.generator.output);

    // extend the DMMF with custom functionality - see "classes" folder
    const extendedDMMF = new ExtendedDMMF(generatorOptions.dmmf, config);

    // If data is present in the output directory, delete it.
    DirectoryHelper.removeDir(output.value);

    // Create the output directory
    DirectoryHelper.createDir(output.value);

    // generate single or multiple files
    if (extendedDMMF.generatorConfig.useMultipleFiles) {
      return generateMultipleFiles({
        dmmf: extendedDMMF,
        path: output.value,
      });
    }

    return generateSingleFile({
      dmmf: extendedDMMF,
      path: output.value,
    });
  },
});
