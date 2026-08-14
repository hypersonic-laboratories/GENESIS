import { useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  CircularProgress,
  DataRow,
  FillProgress,
  DataTable,
  Divider,
  EmptyState,
  ListRow,
  Meter,
  Panel,
  PanelBody,
  PanelFooter,
  PanelHeader,
  Progress,
  Skeleton,
  Slider,
  Stat,
  type Column,
} from "@gns/ui";
import {
  Apple,
  Boxes,
  CalendarClock,
  Coins,
  Droplet,
  Flame,
  Heart,
  Package,
  Shield,
  Users,
  Wind,
  Wrench,
} from "lucide-react";
import { Section, Spec, Variant } from "../Showcase";

interface PlayerRow {
  id: string;
  name: string;
  role: string;
  ping: number;
  balance: number;
}

const players: PlayerRow[] = [
  { id: "1", name: "MS Studios", role: "Owner", ping: 12, balance: 128400 },
  { id: "2", name: "Nova", role: "Moderator", ping: 34, balance: 24150 },
  { id: "3", name: "Halcyon", role: "Player", ping: 78, balance: 980 },
  { id: "4", name: "Rook", role: "Player", ping: 141, balance: 12 },
];

const columns: Column<PlayerRow>[] = [
  {
    key: "name",
    header: "Player",
    render: (row) => (
      <span className="flex items-center gap-2">
        <Avatar size="xs" fallback={row.name.slice(0, 2)} />
        <span className="uppercase text-text">{row.name}</span>
      </span>
    ),
  },
  {
    key: "role",
    header: "Role",
    render: (row) => (
      <Badge tone={row.role === "Owner" ? "signal" : "neutral"} size="sm">
        {row.role}
      </Badge>
    ),
  },
  {
    key: "ping",
    header: "Ping",
    numeric: true,
    width: "5rem",
    render: (row) => (
      <span
        className={
          row.ping > 120
            ? "text-danger"
            : row.ping > 60
              ? "text-warning"
              : "text-success"
        }
      >
        {row.ping} ms
      </span>
    ),
  },
  {
    key: "balance",
    header: "Balance",
    numeric: true,
    render: (row) => `${row.balance.toLocaleString("en-US")} GC`,
  },
];

export function Surfaces() {
  const [selected, setSelected] = useState<string | undefined>("2");
  const [demo, setDemo] = useState(64);

  return (
    <Section
      id="surfaces"
      title="Surfaces & data"
      description="Containers and readouts. A panel holds one coherent task or status family; nested content separates by tone before it adds another border."
    >
      <Spec
        title="Panel"
        note="The shell that touches the game. It carries its own dark fill, because the scene behind it can just as easily be a midday sky as a night alley — and backdrop blur cannot help, since the 3D scene is composited under the page rather than inside it."
        stack
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Panel tone="glass">
            <PanelHeader eyebrow="Draft" title="Blank world" />
            <PanelBody className="text-caption text-text-muted">
              Dark fill at 92%. Enough of the world shows through to read as an
              overlay, never enough to cost legibility.
            </PanelBody>
          </Panel>

          <Panel tone="solid">
            <PanelHeader eyebrow="Opaque" title="Server console" />
            <PanelBody className="text-caption text-text-muted">
              Nothing bleeds through. Use for dense text and long sessions.
            </PanelBody>
          </Panel>

          <Panel tone="well" padding="md">
            <p className="text-overline text-text-subtle">Recessed</p>
            <p className="mt-2 text-caption text-text-muted">
              Reads as a hole in the surface rather than a card on top of it.
            </p>
          </Panel>
        </div>

        <Panel tone="glass" className="max-w-md">
          <PanelHeader
            eyebrow="World"
            title="Blank world"
            actions={<Badge tone="neutral">v0.0</Badge>}
          />
          <PanelBody className="flex flex-col gap-0.5">
            <DataRow
              icon={<CalendarClock />}
              label="Updated"
              value="August 10, 2026"
            />
            <DataRow icon={<Users />} label="Players" value="1/24" />
            <DataRow icon={<Wrench />} label="Game version" value="1.0.0.0" />
            <Divider soft className="my-2" />
            <DataRow label="Network version" value="333402618" />
            <DataRow label="Compatible CL" value="21454" />
          </PanelBody>
          <PanelFooter>
            <Button variant="ghost" size="sm">
              Settings
            </Button>
            <Button variant="primary" size="sm">
              Resume
            </Button>
          </PanelFooter>
        </Panel>
      </Spec>

      <Spec
        title="Readouts"
        note="Stat for a headline number, Meter for a value against a known range, Progress for work the interface started. Bars are notched: counting segments is exact where estimating a proportion is not. Thresholds are the caller's decision — the component renders the state it is given."
        stack
      >
        <div className="grid gap-6 sm:grid-cols-4">
          <Stat label="Balance" value="128,400" icon={<Coins />} hint="GC" />
          <Stat
            label="Players"
            value="1/24"
            icon={<Users />}
            delta={{ value: "3", direction: "up" }}
          />
          <Stat label="Items" value="47" icon={<Package />} />
          <Stat
            label="Uptime"
            value="99.2%"
            delta={{ value: "0.4%", direction: "down" }}
          />
        </div>

        <div className="grid max-w-md gap-3">
          <Meter label="Health" value={82} tone="success" icon={<Heart />} />
          <Meter label="Armour" value={45} tone="info" icon={<Shield />} />
          <Meter label="Hunger" value={22} tone="warning" />
          <Meter label="Stress" value={91} tone="danger" />
          <Meter
            label="Inventory"
            value={7}
            max={10}
            segments={10}
            icon={<Boxes />}
            readout="7/10 slots"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <FillProgress value={82} tone="success" icon={<Heart />} label="Health" />
          <FillProgress value={45} tone="info" icon={<Shield />} label="Armour" />
          <FillProgress value={68} tone="signal" icon={<Droplet />} label="Thirst" />
          <FillProgress value={30} tone="warning" icon={<Apple />} label="Hunger" />
          <FillProgress value={91} tone="danger" icon={<Flame />} label="Stress" />
          <FillProgress value={54} tone="neutral" icon={<Wind />} label="Stamina" />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <FillProgress
            variant="fill-around"
            value={82}
            tone="danger"
            icon={<Heart />}
            label="Health"
            showValue
          />
          <FillProgress
            variant="fill-around"
            value={100}
            tone="success"
            icon={<Shield />}
            label="Armour"
            showValue
          />
          <FillProgress
            variant="fill-around"
            value={65}
            tone="info"
            icon={<Droplet />}
            label="Thirst"
            showValue
          />
          <FillProgress
            variant="fill"
            value={40}
            tone="warning"
            icon={<Apple />}
            label="Hunger"
            size={64}
            showValue
            readout="40%"
          />
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <CircularProgress value={64} label="Upload" />
          <CircularProgress value={28} tone="info" steps={20} label="Shaders" />
          <CircularProgress value={92} tone="success" size={88} label="Sync" />
          <CircularProgress
            value={null}
            tone="warning"
            size={56}
            showValue={false}
          />
          <CircularProgress value={45} tone="danger" size={64} steps={12}>
            <Heart className="size-5 text-danger" />
          </CircularProgress>
        </div>
      </Spec>

      <Spec
        title="Progress"
        note="Outside keeps the bar thin; inside costs no vertical space and puts the caption on a small plaque, so the words stay legible over the notches whatever the fill is doing behind them."
        stack
      >
        <div className="flex max-w-sm items-center gap-4">
          <span className="shrink-0 text-overline text-text-subtle">Value</span>
          <Slider
            value={[demo]}
            onValueChange={([next]) => setDemo(next)}
            showValue
            formatValue={(value) => `${value[0]}%`}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Variant label="outside · label + value" className="w-full">
            <Progress label="Uploading world" value={demo} showValue />
          </Variant>

          <Variant label="outside · icon + label + value" className="w-full">
            <Progress
              label="Uploading world"
              icon={<Package />}
              value={demo}
              showValue
            />
          </Variant>

          <Variant label="outside · value only" className="w-full">
            <Progress
              label="Uploading world"
              showLabel={false}
              value={demo}
              showValue
            />
          </Variant>

          <Variant label="outside · bar only" className="w-full">
            <Progress value={demo} />
          </Variant>

          <Variant label="inside · sm" className="w-full">
            <Progress
              labelPlacement="inside"
              size="sm"
              label="Sync"
              value={demo}
              tone="signal"
              showValue
            />
          </Variant>

          <Variant label="inside · md + icon" className="w-full">
            <Progress
              labelPlacement="inside"
              label="Uploading world"
              icon={<Package />}
              value={demo}
              showValue
            />
          </Variant>

          <Variant label="inside · lg + formatValue" className="w-full">
            <Progress
              labelPlacement="inside"
              size="lg"
              label="Storage"
              icon={<Boxes />}
              value={demo}
              max={100}
              tone="warning"
              steps={32}
              showValue
              formatValue={(value, max) => `${value} / ${max} GB`}
            />
          </Variant>

          <Variant label="inside · value only" className="w-full">
            <Progress
              labelPlacement="inside"
              value={demo}
              tone="success"
              steps={32}
              showValue
            />
          </Variant>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Variant label="steps 8" className="w-full">
            <Progress value={demo} steps={8} />
          </Variant>
          <Variant label="steps 20 (default)" className="w-full">
            <Progress value={demo} steps={20} />
          </Variant>
          <Variant label="steps 48" className="w-full">
            <Progress value={demo} steps={48} />
          </Variant>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {(
            [
              "accent",
              "info",
              "success",
              "warning",
              "danger",
              "signal",
            ] as const
          ).map((tone) => (
            <Variant key={tone} label={tone} className="w-full">
              <Progress value={demo} tone={tone} />
            </Variant>
          ))}
        </div>

        <Variant label="indeterminate" className="w-full max-w-md">
          <Progress label="Connecting" value={null} tone="info" />
        </Variant>
      </Spec>

      <Spec
        title="Rows and lists"
        note="A row is one entity. Selection marks the leading edge rather than recolouring the whole row."
        stack
      >
        <div className="flex max-w-md flex-col gap-1.5">
          {players.slice(0, 3).map((player) => (
            <ListRow
              key={player.id}
              interactive
              selected={selected === player.id}
              onClick={() => setSelected(player.id)}
              leading={
                <Avatar
                  fallback={player.name.slice(0, 2)}
                  status={player.ping < 100 ? "online" : "away"}
                />
              }
              title={player.name}
              subtitle={`${player.role} · ${player.ping} ms`}
              trailing={
                <span className="text-control text-text-muted" data-numeric>
                  {player.balance.toLocaleString("en-US")} GC
                </span>
              }
            />
          ))}
        </div>

        <DataTable
          columns={columns}
          rows={players}
          rowKey={(row) => row.id}
          selectedKey={selected}
          onRowClick={(row) => setSelected(row.id)}
          caption="Connected players"
        />
      </Spec>

      <Spec
        title="Absent and pending"
        note="An empty state says why there is nothing and offers the way out. A skeleton holds the exact geometry of what is loading."
        stack
      >
        <EmptyState
          icon={<Package />}
          title="No items"
          description="Nothing has been placed in this container yet."
          action={
            <Button size="sm" variant="secondary">
              Add item
            </Button>
          }
        />

        <div className="flex items-center gap-3 rounded-md border border-line-faint bg-surface p-3">
          <Skeleton className="size-8 shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-2.5 w-1/2" />
          </div>
          <Skeleton className="h-3 w-16" />
        </div>
      </Spec>
    </Section>
  );
}
