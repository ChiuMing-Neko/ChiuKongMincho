import type Command from "@/typedef/command";
import BuildFontService from "@/services/buildfont.service";
import BuildMasterService from "@/services/buildmaster.service";

class BuildCommand implements Command {
  readonly #payload: string | undefined;
  readonly #buildFont = BuildFontService;
  readonly #buildMaster = BuildMasterService;

  public constructor(payload?: string) {
    this.#payload = payload;
  }

  public async execute() {
    // Build Master
    await this.#buildMaster.validateGlyphFromSource();
    await this.#buildMaster.constructMappingFile();
    await this.#buildMaster.constructVariationSequenceFile();
    await this.#buildMaster.constructFontVariableMasterInstance();
    // Build Variable Font
    await this.#buildFont.buildFontDev("CL"); // Unfinished.
  }
}

export default BuildCommand;
