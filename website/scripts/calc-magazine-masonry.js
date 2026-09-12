/**
 * Compute masonry layout: full width 186mm, fit height 244mm.
 * Picks minimum columns so layout fits and fills the page (no empty side space).
 */
const images = [
  { name: 'mag_01.jpeg', w: 1200, h: 1600 },
  { name: 'mag_02.jpeg', w: 1200, h: 1600 },
  { name: 'mag_03.jpeg', w: 1200, h: 1600 },
  { name: 'mag_04.jpeg', w: 900, h: 1600 },
  { name: 'mag_05.jpeg', w: 960, h: 1280 },
  { name: 'mag_06.jpeg', w: 1200, h: 1600 },
  { name: 'mag_07.jpeg', w: 1600, h: 1200 },
  { name: 'mag_08.jpeg', w: 900, h: 1600 },
  { name: 'mag_09.jpeg', w: 1200, h: 1600 },
  { name: 'mag_10.jpeg', w: 1200, h: 1600 },
  { name: 'mag_11.jpeg', w: 900, h: 1600 },
  { name: 'mag_12.jpeg', w: 960, h: 1280 },
  { name: 'mag_13.jpeg', w: 720, h: 1280 },
  { name: 'mag_14.jpeg', w: 900, h: 1600 },
  { name: 'mag_15.jpeg', w: 900, h: 1600 },
  { name: 'mag_16.jpeg', w: 1200, h: 1600 },
  { name: 'mag_17.jpeg', w: 1200, h: 1600 },
  { name: 'mag_18.jpeg', w: 1204, h: 1600 },
  { name: 'mag_19.jpeg', w: 900, h: 1600 },
];

const CONTENT_WIDTH_MM = 186;
const CONTENT_HEIGHT_MM = 244;
const GAP_MM = 2;

function assignColumns(images, colWidth, numCols) {
  const colHeights = new Array(numCols).fill(0);
  const assignment = [];
  for (const img of images) {
    const imgHeight = colWidth * (img.h / img.w);
    const minCol = colHeights.indexOf(Math.min(...colHeights));
    assignment.push({ ...img, col: minCol, widthMm: colWidth, heightMm: imgHeight });
    colHeights[minCol] += imgHeight + GAP_MM;
  }
  return { assignment, maxHeight: Math.max(...colHeights) };
}

const COLS = 5;
let colWidth = (CONTENT_WIDTH_MM - (COLS - 1) * GAP_MM) / COLS;
let result = assignColumns(images, colWidth, COLS);
if (result.maxHeight > CONTENT_HEIGHT_MM) {
  colWidth = colWidth * (CONTENT_HEIGHT_MM / result.maxHeight);
  result = assignColumns(images, colWidth, COLS);
}

const assign = result.assignment;

function round2(x) {
  return Math.round(x * 100) / 100;
}

function toHtml(items) {
  return items
    .map(
      (a) =>
        `<div class="gallery-smiles__item"><img src="/images/Magazine photos/${a.name}" alt="Children with Law Park" style="width:${round2(a.widthMm)}mm;height:${round2(a.heightMm)}mm;object-fit:cover;display:block;"></div>`
    )
    .join('\n          ');
}

const colArrays = [];
for (let c = 0; c < COLS; c++) {
  colArrays.push(assign.filter((a) => a.col === c));
}

const colHtml = colArrays
  .map(
    (items) =>
      `          <div class="gallery-smiles__col">\n${items.map((a) => `            <div class="gallery-smiles__item"><img src="/images/Magazine photos/${a.name}" alt="Children with Law Park" style="width:${round2(a.widthMm)}mm;height:${round2(a.heightMm)}mm;object-fit:cover;display:block;"></div>`).join('\n')}\n          </div>`
  )
  .join('\n');

console.log('<!-- maxHeight', round2(result.maxHeight), 'mm, colWidth', round2(colWidth), 'mm, COLS', COLS, '-->');
console.log('        <div class="gallery-smiles">\n' + colHtml + '\n        </div>');
