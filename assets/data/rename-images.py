# -*- coding: utf-8 -*-
"""
cars.json의 sourceImage → thumbnail 매핑대로 이미지 파일명을 일괄 변경합니다.

사용법
  1. 원본 png 63장을 SRC 폴더에 모아둔다
  2. python3 rename-images.py
  3. images/buy/ 폴더에 규칙에 맞는 이름으로 복사된다 (원본은 유지)
"""
import json, shutil
from pathlib import Path

SRC  = Path("./원본이미지")      # 한글 파일명 png가 들어있는 폴더
DEST = Path("./images/buy")      # 결과 폴더
JSON = Path("./cars.json")

DEST.mkdir(parents=True, exist_ok=True)
cars = json.loads(JSON.read_text(encoding="utf-8"))

ok, missing = 0, []
for c in cars:
    src = SRC / c["sourceImage"]
    if not src.exists():
        missing.append(c["sourceImage"])
        continue
    # thumbnail은 .jpg 이지만 원본이 .png이므로 확장자는 원본을 따른다
    dst = DEST / (Path(c["thumbnail"]).stem + src.suffix)
    shutil.copy2(src, dst)
    ok += 1

print(f"변환 완료: {ok}장")
if missing:
    print(f"원본을 찾지 못함 {len(missing)}장:")
    for m in missing:
        print("  -", m)
