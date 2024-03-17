import { before, describe, it } from "node:test";
import FontDataInterface from "@/utils/fontdata.interface";
import BuildMasterService from "@/services/buildmaster.service";

describe("Build Master", () => {
  before(async () => {
    await FontDataInterface.getInstance();
  });

  it("Should able to validate Glyph From Source", async () => {
    await BuildMasterService.validateGlyphFromSource();
  });

  it("Should able to generate cmap resource", async () => {
    await BuildMasterService.constructMappingFile();
  });
});
