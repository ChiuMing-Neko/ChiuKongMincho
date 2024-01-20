import assert from "node:assert";
import { before, describe, it } from "node:test";
import FontDataInterface from "@/utils/fontdata.interface";

describe("FontDataInterface", () => {
  before(async () => {
    await FontDataInterface.getInstance();
  });

  it("Should able to get correct mapping", async () => {
    const fontdata = await FontDataInterface.getInstance();
    const mapData = fontdata.mappingData;
    const targetMapInfo = mapData.get("59D8");
    assert.ok(targetMapInfo);
    const clMapInfo = targetMapInfo["CL"];
    assert.ok(clMapInfo);
    assert.strictEqual(clMapInfo, 14431);
  });

  it("Should able to get correct uvs info", async () => {
    const fontdata = await FontDataInterface.getInstance();
    const uvsData = fontdata.uvsInfoData;
    const targetUVSInfoList = uvsData.get("59D8");
    assert.ok(targetUVSInfoList);
    const targetUVSInfo = targetUVSInfoList.get("E0100");
    assert.ok(targetUVSInfo);
    assert.strictEqual(targetUVSInfo.cid, 14430);
    assert.strictEqual(targetUVSInfo.collection, "Moji_Joho");
  });

  it("Should able to get new glyph info", async () => {
    const fontdata = await FontDataInterface.getInstance();
    const newGlyphData = fontdata.newGlyphInfoData;
    const targetGlyphName = newGlyphData.get(40803);
    assert.ok(targetGlyphName);
    assert.strictEqual(targetGlyphName, "uni9109-SCS-CL");
  });

  it("Should able to write mapping info data", async () => {
    const fontdata = await FontDataInterface.getInstance();
    await fontdata.writeMappingData(["CL", "MN", "JP"]);
  });

  it("Should able to write uvs info data", async () => {
    const fontdata = await FontDataInterface.getInstance();
    await fontdata.writeUVSData();
  });
});
