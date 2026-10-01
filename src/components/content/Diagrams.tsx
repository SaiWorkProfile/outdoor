import type { ComponentType, ReactNode } from 'react';
import { ENGINE_ASSUMPTIONS } from '@/data/assumptions';
import type { DiagramId } from '@/content/types';

/**
 * Original inline SVG diagrams.
 *
 * These are drawn from the project's own planning assumptions rather than
 * copied illustrations, and they stay lightweight: no image requests and no
 * decorative stock photography. Labels are real text, so they scale cleanly and
 * are announced by assistive technology.
 *
 * Arrow heads are drawn as polygons rather than SVG markers, so nothing here
 * emits an element id and two diagrams on one page cannot collide.
 */

const FILL_SURFACE = '#eef2ec';
const FILL_MID = '#cfe0d4';
const FILL_DEEP = '#b6cdbe';
const FILL_ACCENT = '#e4efe7';
const LINE = '#dfe5df';
const TEXT = '#414c44';
const MUTED = '#5f6a61';
const BRAND = '#23623d';

function Frame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 640 240" role="img" aria-label={label} preserveAspectRatio="xMidYMid meet">
      <title>{label}</title>
      {children}
    </svg>
  );
}

/** A dimension line with a drawn arrow head at each end. */
function Dimension({ x1, y1, x2, y2, text, dx = 0, dy = 0 }: { x1: number; y1: number; x2: number; y2: number; text: string; dx?: number; dy?: number }) {
  const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  const head = (x: number, y: number, rotation: number) => (
    <polygon points="0,0 -8,3.4 -8,-3.4" transform={`translate(${x} ${y}) rotate(${rotation})`} fill={BRAND} />
  );
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={BRAND} strokeWidth="1.2" />
      {head(x1, y1, angle + 180)}
      {head(x2, y2, angle)}
      <text x={(x1 + x2) / 2 + dx} y={(y1 + y2) / 2 + dy} fill={BRAND} fontSize="11" textAnchor="middle">
        {text}
      </text>
    </g>
  );
}

function AreaMeasure() {
  return (
    <Frame label="Diagram: an area is length times width, and depth turns that area into a volume">      <rect x="70" y="50" width="300" height="140" fill={FILL_SURFACE} stroke={MUTED} />
      <rect x="70" y="90" width="300" height="60" fill={FILL_ACCENT} stroke={MUTED} strokeDasharray="4 3" />
      <Dimension x1={70} y1={212} x2={370} y2={212} text="length × width = square feet" dy={-6} />
      <Dimension x1={52} y1={90} x2={52} y2={150} text="depth" dx={-2} dy={-6} />
      <text x="220" y="124" textAnchor="middle" fontSize="12" fill={TEXT}>
        area in square feet
      </text>
      <text x="430" y="72" fontSize="12" fill={TEXT}>
        Square feet does not
      </text>
      <text x="430" y="90" fontSize="12" fill={TEXT}>
        tell you the volume.
      </text>
      <text x="430" y="116" fontSize="11" fill={MUTED}>
        area × depth ÷ 12 = cubic feet
      </text>
      <text x="430" y="134" fontSize="11" fill={MUTED}>
        cubic feet ÷ 27 = cubic yards
      </text>
      <text x="430" y="152" fontSize="11" fill={MUTED}>
        cubic yards × density = tons
      </text>
    </Frame>
  );
}

function GravelDepth() {
  return (
    <Frame label="Diagram: gravel volume is the surface area multiplied by the loose depth before compaction">      <rect x="80" y="70" width="380" height="90" fill={FILL_SURFACE} stroke={MUTED} />
      <rect x="80" y="70" width="380" height="30" fill={FILL_MID} stroke={MUTED} />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <circle key={i} cx={100 + i * 40} cy={80 + (i % 2) * 14} r="4" fill={FILL_DEEP} />
      ))}
      <Dimension x1={80} y1={182} x2={460} y2={182} text="surface area" dy={-6} />
      <Dimension x1={500} y1={70} x2={500} y2={100} text="depth" dx={30} dy={4} />
      <text x="270" y="45" textAnchor="middle" fontSize="13" fill={TEXT}>
        Loose gravel, before compaction
      </text>
      <text x="270" y="215" textAnchor="middle" fontSize="11" fill={MUTED}>
        Area × depth ÷ 12 = cubic feet, then ÷ 27 = cubic yards
      </text>
      <text x="270" y="232" textAnchor="middle" fontSize="11" fill={MUTED}>
        The order volume also allows for compaction and waste
      </text>
    </Frame>
  );
}

function MulchDepth() {
  return (
    <Frame label="Diagram: mulch depth in a planting bed, with a clear gap around the plant stem">      <rect x="60" y="140" width="520" height="60" fill={FILL_SURFACE} stroke={LINE} />
      <rect x="60" y="120" width="205" height="20" fill={FILL_MID} stroke={MUTED} />
      <rect x="375" y="120" width="205" height="20" fill={FILL_MID} stroke={MUTED} />
      <path d="M320 120 L320 58" stroke={BRAND} strokeWidth="3" />
      <path d="M320 74 C286 64 278 46 268 34" stroke={BRAND} strokeWidth="2" fill="none" />
      <path d="M320 74 C354 64 362 46 372 34" stroke={BRAND} strokeWidth="2" fill="none" />
      <text x="320" y="112" textAnchor="middle" fontSize="10" fill={BRAND}>
        keep mulch off the stem
      </text>
      <Dimension x1={430} y1={120} x2={430} y2={140} text="2–4 in" dx={32} />
      <text x="80" y="134" fontSize="12" fill={TEXT}>
        mulch layer, measured after it settles
      </text>
      <text x="80" y="176" fontSize="12" fill={MUTED}>
        existing soil
      </text>
      <text x="60" y="224" fontSize="11" fill={MUTED}>
        Mulch is normally sold by volume, so weight matters far less than cubic yards
      </text>
    </Frame>
  );
}

function DrivewayLayers() {
  const layers = ENGINE_ASSUMPTIONS.driveway.layers;
  const heights = [46, 30, 30];
  let y = 190;
  return (
    <Frame label="Diagram: a gravel driveway planned as a base layer, a middle layer and a surface layer over prepared ground">      {layers.map((layer, i) => {
        y -= heights[i];
        const fill = i === 0 ? FILL_DEEP : i === 1 ? FILL_MID : FILL_SURFACE;
        const top = y;
        return (
          <g key={layer.name}>
            <rect x="80" y={top} width="400" height={heights[i]} fill={fill} stroke={MUTED} />
            <text x="94" y={top + heights[i] / 2 + 4} fontSize="12" fill={TEXT}>
              {layer.name}
            </text>
            <text x="468" y={top + heights[i] / 2 + 4} fontSize="11" fill={MUTED} textAnchor="end">
              {layer.depthIn} in planned
            </text>
          </g>
        );
      })}
      <line x1="80" y1="190" x2="480" y2="190" stroke={MUTED} strokeWidth="2" />
      <text x="80" y="212" fontSize="12" fill={MUTED}>
        prepared, compacted subgrade
      </text>
      <text x="520" y="104" fontSize="11" fill={MUTED}>
        Each layer is
      </text>
      <text x="520" y="120" fontSize="11" fill={MUTED}>
        calculated on its
      </text>
      <text x="520" y="136" fontSize="11" fill={MUTED}>
        own depth, then
      </text>
      <text x="520" y="152" fontSize="11" fill={MUTED}>
        compacted before
      </text>
      <text x="520" y="168" fontSize="11" fill={MUTED}>
        the next layer.
      </text>
    </Frame>
  );
}

function FenceComponents() {
  return (
    <Frame label="Diagram: fence components showing posts, rails, pickets, a gate opening and a concrete post hole">      <line x1="60" y1="170" x2="580" y2="170" stroke={MUTED} />
      {[90, 230, 370, 510].map((x) => (
        <rect key={x} x={x - 4} y={62} width="8" height="128" fill={FILL_DEEP} stroke={MUTED} />
      ))}
      {[92, 118].map((y) => (
        <rect key={y} x="86" y={y} width="288" height="7" fill={FILL_MID} stroke={MUTED} />
      ))}
      {Array.from({ length: 14 }).map((_, i) => (
        <rect key={i} x={94 + i * 20} y="70" width="12" height="96" fill={FILL_SURFACE} stroke={LINE} />
      ))}
      <rect x="378" y="60" width="128" height="106" fill="none" stroke={BRAND} strokeWidth="2" strokeDasharray="5 4" />
      <text x="442" y="118" textAnchor="middle" fontSize="12" fill={BRAND}>
        gate opening
      </text>
      <rect x="226" y="170" width="16" height="40" fill={FILL_SURFACE} stroke={MUTED} />
      <text x="250" y="200" fontSize="11" fill={MUTED}>
        post hole filled with concrete
      </text>
      <text x="60" y="52" fontSize="12" fill={TEXT}>
        line posts, rails and pickets or panel sections
      </text>
      <text x="580" y="52" fontSize="11" fill={MUTED} textAnchor="end">
        gate posts are counted separately
      </text>
      <text x="60" y="230" fontSize="11" fill={MUTED}>
        Every component is counted from the fence length, the post spacing and the openings you enter
      </text>
    </Frame>
  );
}

function PostHole() {
  return (
    <Frame label="Diagram: a cylindrical post hole with the post set in concrete, showing diameter and depth">      <rect x="60" y="70" width="180" height="120" fill={FILL_SURFACE} stroke={LINE} />
      <path d="M300 70 L300 170 A30 30 0 0 1 360 170 L360 70 Z" fill={FILL_MID} stroke={MUTED} transform="translate(-30 0)" />
      <rect x="306" y="40" width="18" height="130" fill={FILL_DEEP} stroke={MUTED} />
      <ellipse cx="315" cy="70" rx="30" ry="8" fill={FILL_SURFACE} stroke={MUTED} />
      <Dimension x1={300} y1={205} x2={330} y2={205} text="diameter" dy={16} />
      <Dimension x1={266} y1={70} x2={266} y2={170} text="depth" dx={-4} dy={-22} />
      <text x="60" y="216" fontSize="12" fill={MUTED}>
        Volume = π × radius² × depth for each hole, then × the number of holes
      </text>
      <text x="60" y="234" fontSize="12" fill={MUTED}>
        Hole diameter and depth are editable planning assumptions, not code requirements
      </text>
      <text x="430" y="100" fontSize="12" fill={TEXT}>
        post set in concrete
      </text>
    </Frame>
  );
}

function PaverLayers() {
  return (
    <Frame label="Diagram: paver patio build-up with pavers, bedding sand, compacted base and edge restraint">      <rect x="80" y="176" width="400" height="34" fill={FILL_SURFACE} stroke={MUTED} />
      <rect x="80" y="146" width="400" height="30" fill={FILL_DEEP} stroke={MUTED} />
      <rect x="80" y="134" width="400" height="12" fill={FILL_MID} stroke={MUTED} />
      {Array.from({ length: 8 }).map((_, i) => (
        <rect key={i} x={84 + i * 50} y="116" width="46" height="18" fill={FILL_ACCENT} stroke={MUTED} />
      ))}
      <rect x="480" y="116" width="14" height="94" fill={FILL_MID} stroke={MUTED} />
      <text x="96" y="130" fontSize="11" fill={TEXT}>
        pavers
      </text>
      <text x="96" y="144" fontSize="11" fill={TEXT}>
        bedding sand {ENGINE_ASSUMPTIONS.paver.beddingSandDepthIn} in
      </text>
      <text x="96" y="167" fontSize="11" fill={TEXT}>
        base {ENGINE_ASSUMPTIONS.paver.baseDepthIn} in, compacted in layers
      </text>
      <text x="96" y="198" fontSize="11" fill={TEXT}>
        compacted subgrade
      </text>
      <text x="502" y="152" fontSize="10" fill={MUTED}>
        edge
      </text>
      <text x="502" y="164" fontSize="10" fill={MUTED}>
        restraint
      </text>
      <text x="290" y="42" textAnchor="middle" fontSize="12" fill={TEXT}>
        Each layer is calculated from the same measured area
      </text>
      <text x="290" y="62" textAnchor="middle" fontSize="11" fill={MUTED}>
        Depth defaults are planning values you can change per project
      </text>
    </Frame>
  );
}

function SlabSection() {
  return (
    <Frame label="Diagram: a concrete slab in section, with thickness measured from the prepared subgrade">      <rect x="70" y="150" width="440" height="50" fill={FILL_SURFACE} stroke={MUTED} />
      <rect x="70" y="110" width="440" height="40" fill={FILL_MID} stroke={MUTED} />
      <rect x="70" y="122" width="440" height="28" fill={FILL_ACCENT} stroke={LINE} />
      <Dimension x1={80} y1={110} x2={80} y2={150} text="thickness" dx={44} />
      <Dimension x1={70} y1={216} x2={510} y2={216} text="length" dy={-6} />
      <Dimension x1={556} y1={110} x2={556} y2={150} text="width" dx={26} dy={-14} />
      <text x="290" y="142" textAnchor="middle" fontSize="12" fill={TEXT}>
        concrete
      </text>
      <text x="290" y="180" textAnchor="middle" fontSize="12" fill={MUTED}>
        prepared subgrade
      </text>
      <text x="290" y="92" textAnchor="middle" fontSize="11" fill={MUTED}>
        Volume = length × width × thickness, plus a waste allowance
      </text>
    </Frame>
  );
}

function DeckParts() {
  return (
    <Frame label="Diagram: deck boards running across joists, with a rim joist and beam below">      {Array.from({ length: 7 }).map((_, i) => (
        <rect key={i} x="80" y={76 + i * 17} width="430" height="13" fill={FILL_SURFACE} stroke={LINE} />
      ))}
      {[80, 152, 224, 296, 368, 440, 512].map((x) => (
        <rect key={x} x={x - 4} y="70" width="8" height="120" fill="none" stroke={BRAND} strokeWidth="1.4" strokeDasharray="4 3" />
      ))}
      <rect x="70" y="192" width="450" height="10" fill={FILL_MID} stroke={MUTED} />
      {[140, 320, 480].map((x) => (
        <rect key={x} x={x - 6} y="202" width="12" height="24" fill={FILL_DEEP} stroke={MUTED} />
      ))}
      <text x="70" y="60" fontSize="11" fill={MUTED}>
        decking boards, with the gap exaggerated for clarity
      </text>
      <text x="520" y="120" fontSize="11" fill={BRAND} textAnchor="end">
        joists at the spacing you enter
      </text>
      <text x="70" y="240" fontSize="11" fill={MUTED}>
        Rim joist, beam and post counts come from your own framing plan. The estimator only counts material you specify.
      </text>
    </Frame>
  );
}

const DIAGRAMS: Record<DiagramId, ComponentType> = {
  'area-measure': AreaMeasure,
  'gravel-depth': GravelDepth,
  'mulch-depth': MulchDepth,
  'driveway-layers': DrivewayLayers,
  'fence-components': FenceComponents,
  'post-hole': PostHole,
  'paver-layers': PaverLayers,
  'slab-section': SlabSection,
  'deck-parts': DeckParts,
};

export function Diagram({ id, caption }: { id: DiagramId; caption: string }) {
  const Figure = DIAGRAMS[id];
  if (!Figure) return null;
  return (
    <figure className="diagram">
      <Figure />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}


