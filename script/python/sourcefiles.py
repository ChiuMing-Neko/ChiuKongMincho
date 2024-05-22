import argparse
import os
from fontTools.t1Lib import T1Font


class ArgParseNamespace(argparse.Namespace):
  glyphlist: bool
  filepath: str
  filename: str


def get_source_file_glyphlist(dirPath: str, filename: str) -> None:
  """
  Get the glyph list in font
  """
  script_path = os.path.dirname(os.path.abspath(__file__))
  font_path = os.path.abspath(os.path.join(script_path, dirPath, filename))
  font = T1Font(font_path)
  glyph_names = font.getGlyphSet()
  for name in glyph_names:
    print(name)


def main() -> None:
  parser = argparse.ArgumentParser()
  parser.add_argument("--glyphlist", action="store_true", help="flag to indicate to get glyph list")
  parser.add_argument("--filepath", type=str, help="directory to file")
  parser.add_argument("--filename", type=str, help="file name")

  args: ArgParseNamespace = parser.parse_args()

  if args.glyphlist and args.filepath and args.filename:
    get_source_file_glyphlist(args.filepath, args.filename)
  else:
    parser.print_help()
    raise SystemExit("Error: Missing required arguments.")


if __name__ == "__main__":
  main()
