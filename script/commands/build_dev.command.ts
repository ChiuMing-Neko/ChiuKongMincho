import type Command from "@/typedef/command";
import BuildFontService from "@/services/buildfont.service";
import BuildMasterService from "@/services/buildmaster.service";
import FeatureService from "@/services/feature.service";
import FontDataInterface from "@/utils/fontdata.interface";

class BuildDevCommand implements Command {
  readonly #payload: string | undefined;
  readonly #buildFont = BuildFontService;
  readonly #buildMaster = BuildMasterService;
  readonly #feature = FeatureService;

  public constructor(payload?: string) {
    this.#payload = payload;
  }

  public async execute(): Promise<void> {
    const fontDataInterface = await FontDataInterface.getInstance();
    // Build Master
    await this.#buildMaster.validateGlyphFromSource();
    await this.#buildMaster.constructMappingFile();
    await this.#buildMaster.constructVariationSequenceFile();
    await this.#buildMaster.constructFontVariableMasterInstance();
    // Export data
    await fontDataInterface.exportNewGlyphsData();
    // Build DEV fea
    await this.#feature.writeDevGSUBfile("CL");
    // Build Variable Font
    await this.#buildFont.buildFontDev("CL");
  }
}

export default BuildDevCommand;
