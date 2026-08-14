import { useState, type ReactNode } from "react";
import { log, request, submitTo, useVisibility } from "@gns/helix";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuTrigger,
  DataRow,
  DataTable,
  Divider,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  EmptyState,
  Field,
  FillProgress,
  Form,
  FormField,
  FormMessage,
  FormReset,
  FormSubmit,
  IconButton,
  Input,
  Keybind,
  ListRow,
  Meter,
  Modal,
  ModalClose,
  ModalContent,
  ModalTrigger,
  NumberStepper,
  Panel,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Progress,
  Radio,
  RadioGroup,
  Segmented,
  Select,
  Skeleton,
  Slider,
  Stat,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Textarea,
  Toggle,
  Tooltip,
  cn,
  useForm,
  useToast,
  type Column,
} from "@gns/ui";
import {
  Activity,
  Apple,
  ArrowDownLeft,
  ArrowUpRight,
  Boxes,
  Coins,
  Droplet,
  Ellipsis,
  Eye,
  Flame,
  Gamepad2,
  Heart,
  Layers,
  LayoutGrid,
  List,
  LogOut,
  Package,
  Pencil,
  Play,
  Search,
  Send,
  Settings,
  Shield,
  Sliders,
  Split,
  Star,
  Trash2,
  Users,
  Wind,
  X,
} from "lucide-react";

/** A labelled block inside a tab, so nothing floats without context. */
function Group({
  title,
  hint,
  children,
  className,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={className}>
      <header className="mb-2 flex items-baseline gap-2">
        <h3 className="shrink-0 text-overline text-text-subtle">{title}</h3>
        {hint ? (
          <p className="truncate text-caption text-text-disabled">{hint}</p>
        ) : null}
      </header>
      <div className="rounded-md border border-line-faint bg-black/15 p-3">
        {children}
      </div>
    </section>
  );
}

/**
 * Caption for a single demo. Deliberately not `Field`: that wires a `<label>`
 * to a control id, and there is no control here to point it at.
 */
function Demo({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-micro uppercase text-text-disabled">{label}</span>
      {children}
    </div>
  );
}

/*
 * Defined at module scope so its identity is stable across renders. The mock
 * is what the browser sees; in game the reply comes from the `gnsui:profile`
 * handler in client.lua, which is where the validation actually lives.
 */
const saveProfile = submitTo("gnsui:profile", {
  ok: false,
  errors: { displayName: "Browser mock: no Lua to answer." },
});

interface PlayerRow {
  id: string;
  name: string;
  role: string;
  ping: number;
}

const players: PlayerRow[] = [
  { id: "1", name: "MS Studios", role: "Owner", ping: 12 },
  { id: "2", name: "Nova", role: "Moderator", ping: 34 },
  { id: "3", name: "Halcyon", role: "Player", ping: 118 },
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
    width: "5.5rem",
    render: (row) => (
      <span className={row.ping > 100 ? "text-warning" : "text-success"}>
        {row.ping} ms
      </span>
    ),
  },
];

/**
 * The in-game demo.
 *
 * It doubles as the acceptance test: everything here is something that can
 * behave differently inside CEF than in a browser — portalled overlays, custom
 * properties, clip paths, filters, pointer capture, and the Lua round trip.
 * If a screen renders correctly here, the library is safe to build on.
 */
export function App() {
  const { close } = useVisibility();
  const { toast } = useToast();

  const [tab, setTab] = useState("actions");
  const [volume, setVolume] = useState([70]);
  const [fov, setFov] = useState([90]);
  const [range, setRange] = useState([20, 80]);
  const [quantity, setQuantity] = useState(3);
  const [demo, setDemo] = useState(64);
  const [voice, setVoice] = useState(true);
  const [view, setView] = useState("grid");
  const [filters, setFilters] = useState<string[]>(["weapons"]);
  const [selected, setSelected] = useState<string | undefined>("2");
  const [events, setEvents] = useState<{ dir: "out" | "in"; text: string }[]>(
    [],
  );

  // Direction is a field rather than an arrow baked into the string: ← and →
  // live outside the latin subset we ship, so the client would render them
  // from a fallback font.
  const record = (dir: "out" | "in", text: string) =>
    setEvents((current) => [{ dir, text }, ...current].slice(0, 5));

  const toggleFilter = (id: string) =>
    setFilters((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );

  const profile = useForm({
    initialValues: { displayName: "MS Studios", region: "eu-west", motd: "" },
    onSubmit: saveProfile,
    onSuccess: (_data, values) => {
      record("in", `profile accepted: ${values.displayName}`);
      toast({ title: "Profile saved", tone: "success" });
    },
    onError: () => record("in", "profile rejected"),
  });

  const ping = async () => {
    record("out", "gnsui:ping");
    log.info("harness ping");
    const reply = await request<{ ok: boolean; at?: string }>(
      "gnsui:ping",
      { from: "harness" },
      { ok: true, at: "browser mock" },
    );
    record("in", JSON.stringify(reply));
  };

  return (
    <div className="grid h-full place-items-center p-5">
      <Panel
        tone="glass"
        padding="none"
        className="grain flex max-h-full w-[min(74rem,100%)] flex-col overflow-hidden"
      >
        <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            <p className="text-overline text-text-subtle">
              HELIX package harness
            </p>
            <h1 className="mt-1 text-title uppercase text-text">Genesis UI</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone="success" dot>
              Rendered
            </Badge>
            <Badge tone="neutral">v0.1.0</Badge>
            <Tooltip content="Close" keybind="Esc">
              <IconButton
                aria-label="Close"
                variant="ghost"
                size="sm"
                icon={<X />}
                onClick={close}
              />
            </Tooltip>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <Tabs value={tab} onValueChange={setTab}>
            <TabList
              aside={
                <div className="flex items-center gap-1 pb-2">
                  <Keybind size="sm">F10</Keybind>
                </div>
              }
            >
              <Tab value="actions" icon={<Play />}>
                Actions
              </Tab>
              <Tab value="forms" icon={<Sliders />}>
                Forms
              </Tab>
              <Tab value="data" icon={<Activity />}>
                Data
              </Tab>
              <Tab value="overlays" icon={<Layers />}>
                Overlays
              </Tab>
              <Tab value="system" icon={<Gamepad2 />}>
                System
              </Tab>
            </TabList>

            {/* ------------------------------------------------ Actions */}
            <TabPanel value="actions" className="pt-5">
              <div className="grid gap-5 lg:grid-cols-2">
                <Group title="Variants" hint="one primary per context">
                  <div className="flex flex-wrap items-center gap-2">
                    <Button variant="primary" icon={<Play />}>
                      Resume
                    </Button>
                    <Button variant="secondary" icon={<Settings />}>
                      Settings
                    </Button>
                    <Button variant="subtle">Subtle</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="danger" icon={<LogOut />} onClick={close}>
                      Leave
                    </Button>
                    <Button variant="danger-ghost" icon={<Trash2 />}>
                      Delete
                    </Button>
                  </div>
                </Group>

                <Group title="Sizes and states" hint="note the clipped corner">
                  <div className="flex flex-wrap items-center gap-2">
                    <Button size="xs">XS</Button>
                    <Button size="sm">SM</Button>
                    <Button size="md">MD</Button>
                    <Button size="lg">LG</Button>
                    <Button variant="primary" loading>
                      Saving
                    </Button>
                    <Button disabled>Disabled</Button>
                  </div>
                </Group>

                <Group title="Icon buttons">
                  <div className="flex flex-wrap items-center gap-2">
                    <IconButton aria-label="Search" icon={<Search />} />
                    <IconButton
                      aria-label="Favourite"
                      variant="ghost"
                      icon={<Star />}
                    />
                    <IconButton
                      aria-label="Edit"
                      variant="subtle"
                      icon={<Pencil />}
                    />
                    <IconButton
                      aria-label="Delete"
                      variant="danger"
                      icon={<Trash2 />}
                    />
                    <IconButton
                      aria-label="Play"
                      variant="primary"
                      size="lg"
                      icon={<Play />}
                    />
                  </div>
                </Group>

                <Group title="Chips, badges, keybinds">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {[
                        { id: "weapons", label: "Weapons" },
                        { id: "tools", label: "Tools" },
                        { id: "medical", label: "Medical" },
                      ].map((filter) => (
                        <Chip
                          key={filter.id}
                          selected={filters.includes(filter.id)}
                          onClick={() => toggleFilter(filter.id)}
                        >
                          {filter.label}
                        </Chip>
                      ))}
                      <Chip icon={<Coins />} onRemove={() => undefined}>
                        Under 500
                      </Chip>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="neutral">v0.0</Badge>
                      <Badge tone="success" dot>
                        Online
                      </Badge>
                      <Badge tone="warning" variant="outline">
                        Degraded
                      </Badge>
                      <Badge tone="danger" variant="solid">
                        Wanted
                      </Badge>
                      <Badge tone="info" icon={<Users />}>
                        1/24
                      </Badge>
                      <Badge tone="signal" pill>
                        Epic
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-caption text-text-faint">
                      <Keybind>Q</Keybind>
                      <Keybind>E</Keybind>
                      <Keybind>F10</Keybind>
                      <Keybind pressed>Shift</Keybind>
                      <span>
                        Hold <Keybind size="sm">E</Keybind> to interact
                      </span>
                    </div>
                  </div>
                </Group>
              </div>
            </TabPanel>

            {/* -------------------------------------------------- Forms */}
            <TabPanel value="forms" className="pt-5">
              <div className="grid gap-5 lg:grid-cols-2">
                <Group title="Text">
                  <div className="flex flex-col gap-4">
                    <Field label="Display name" hint="Visible to other players.">
                      <Input defaultValue="MS Studios" />
                    </Field>
                    <Field label="Search">
                      <Input placeholder="Filter items" prefix={<Search />} />
                    </Field>
                    <Field
                      label="Transfer amount"
                      error="Insufficient balance."
                      required
                    >
                      <Input
                        defaultValue="12500"
                        prefix={<Coins />}
                        suffix="GC"
                      />
                    </Field>
                    <Field label="Description" aside="0/240">
                      <Textarea placeholder="Describe the world" rows={2} />
                    </Field>
                  </div>
                </Group>

                <Group title="Choice" hint="animated check, sliding thumb">
                  <div className="flex flex-col gap-4">
                    <Field label="Region">
                      <Select
                        defaultValue="eu-west"
                        options={[
                          { value: "eu-west", label: "EU West" },
                          { value: "eu-north", label: "EU North" },
                          { value: "na-east", label: "NA East" },
                          { value: "sa", label: "South America", disabled: true },
                        ]}
                      />
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2.5">
                        <Checkbox defaultChecked label="Allow spectators" />
                        <Checkbox checked="indeterminate" label="Partial" />
                        <Checkbox disabled label="Locked" />
                      </div>
                      <RadioGroup defaultValue="everyone">
                        <Radio value="everyone" label="Everyone" />
                        <Radio value="teen" label="Teen" />
                        <Radio value="mature" label="Mature" />
                      </RadioGroup>
                    </div>

                    <Divider soft />

                    <Toggle
                      checked={voice}
                      onCheckedChange={setVoice}
                      label="Proximity voice"
                      reversed
                    />
                    <Toggle label="Friendly fire" reversed />
                  </div>
                </Group>

                <Group title="Numeric" hint="squared track, ticks, bar handle">
                  <div className="flex flex-col gap-4">
                    <Field label="Master volume">
                      <Slider
                        value={volume}
                        onValueChange={setVolume}
                        showValue
                        formatValue={(value) => `${value[0]}%`}
                      />
                    </Field>
                    <Field label="Field of view">
                      <Slider
                        value={fov}
                        onValueChange={setFov}
                        min={60}
                        max={120}
                        step={5}
                        ticks={6}
                        showValue
                        formatValue={(value) => `${value[0]}°`}
                      />
                    </Field>
                    <Field label="Player range">
                      <Slider
                        value={range}
                        onValueChange={setRange}
                        showValue
                      />
                    </Field>
                    <Field label="Quantity">
                      <NumberStepper
                        value={quantity}
                        onValueChange={setQuantity}
                        min={1}
                        max={64}
                        unit="pcs"
                      />
                    </Field>
                  </div>
                </Group>

                <Group
                  title="Server form"
                  hint="values go to Lua; the verdict comes back"
                  className="lg:col-span-2"
                >
                  <Form form={profile} className="max-w-xl">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        name="displayName"
                        label="Display name"
                        hint="At least 3 characters."
                        required
                      >
                        {(field) => <Input {...field.inputProps} />}
                      </FormField>

                      <FormField name="region" label="Region">
                        {(field) => (
                          <Select
                            value={field.value as string}
                            onValueChange={field.setValue}
                            invalid={field.invalid}
                            options={[
                              { value: "eu-west", label: "EU West" },
                              { value: "eu-north", label: "EU North" },
                              { value: "na-east", label: "NA East" },
                              { value: "banned", label: "Restricted region" },
                            ]}
                          />
                        )}
                      </FormField>
                    </div>

                    <FormField
                      name="motd"
                      label="Message of the day"
                      hint="Optional. Rejected if it exceeds 40 characters."
                    >
                      {(field) => (
                        <Textarea rows={2} {...field.inputProps} />
                      )}
                    </FormField>

                    <FormMessage successText="The server accepted the profile." />

                    <div className="flex items-center justify-end gap-2">
                      <FormReset>Reset</FormReset>
                      <FormSubmit requireDirty icon={<Send />}>
                        Save profile
                      </FormSubmit>
                    </div>
                  </Form>
                </Group>

                <Group title="Segments" hint="exactly one selection, always">
                  <div className="flex flex-wrap items-center gap-3">
                    <Segmented
                      aria-label="View"
                      value={view}
                      onValueChange={setView}
                      options={[
                        { value: "grid", label: "Grid", icon: <LayoutGrid /> },
                        { value: "list", label: "List", icon: <List /> },
                        { value: "slots", label: "Slots", icon: <Boxes /> },
                      ]}
                    />
                    <Segmented
                      aria-label="Density"
                      size="sm"
                      value={view === "list" ? "compact" : "default"}
                      onValueChange={() => undefined}
                      options={[
                        { value: "default", label: "Default" },
                        { value: "compact", label: "Compact" },
                      ]}
                    />
                  </div>
                </Group>
              </div>
            </TabPanel>

            {/* --------------------------------------------------- Data */}
            <TabPanel value="data" className="pt-5">
              <div className="grid gap-5 lg:grid-cols-2">
                <Group title="Status tiles" hint="fill floods, fill-around tracks">
                  <div className="flex flex-col gap-3">
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
                        value={40}
                        tone="warning"
                        icon={<Apple />}
                        label="Hunger"
                        size={64}
                        showValue
                        readout="40%"
                      />
                    </div>
                  </div>
                </Group>

                <Group title="Rings" hint="notched, partial head segment">
                  <div className="flex flex-wrap items-center justify-around gap-4">
                    <CircularProgress value={64} label="Upload" />
                    <CircularProgress value={28} tone="info" steps={20} label="Shaders" />
                    <CircularProgress value={92} tone="success" size={88} label="Sync" />
                    <CircularProgress value={null} tone="warning" size={56} showValue={false} />
                    <CircularProgress value={45} tone="danger" size={64} steps={12}>
                      <Heart className="size-5 text-danger" />
                    </CircularProgress>
                  </div>
                </Group>

                <Group title="Meters" hint="a reading, not a task">
                  <div className="flex flex-col gap-3">
                    <Meter label="Health" value={82} tone="success" icon={<Heart />} />
                    <Meter label="Armour" value={45} tone="info" icon={<Shield />} />
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
                </Group>

                <Group
                  title="Progress variants"
                  hint="drive the value; the inside caption rides its own plaque"
                  className="lg:col-span-2"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex max-w-xs items-center gap-3">
                      <span className="shrink-0 text-overline text-text-subtle">
                        Value
                      </span>
                      <Slider
                        value={[demo]}
                        onValueChange={([next]) => setDemo(next)}
                        showValue
                        formatValue={(value) => `${value[0]}%`}
                      />
                    </div>

                    <div className="grid gap-x-6 gap-y-4 md:grid-cols-2">
                      <Demo label="outside · icon + label + value">
                        <Progress
                          label="Uploading world"
                          icon={<Package />}
                          value={demo}
                          showValue
                        />
                      </Demo>
                      <Demo label="outside · value only">
                        <Progress
                          label="Uploading world"
                          showLabel={false}
                          value={demo}
                          showValue
                        />
                      </Demo>
                      <Demo label="inside · sm">
                        <Progress
                          labelPlacement="inside"
                          size="sm"
                          label="Sync"
                          value={demo}
                          tone="signal"
                          showValue
                        />
                      </Demo>
                      <Demo label="inside · md + icon">
                        <Progress
                          labelPlacement="inside"
                          label="Uploading"
                          icon={<Package />}
                          value={demo}
                          showValue
                        />
                      </Demo>
                      <Demo label="inside · lg + formatValue">
                        <Progress
                          labelPlacement="inside"
                          size="lg"
                          label="Storage"
                          icon={<Boxes />}
                          value={demo}
                          tone="warning"
                          steps={32}
                          showValue
                          formatValue={(value, max) => `${value} / ${max} GB`}
                        />
                      </Demo>
                      <Demo label="inside · value only">
                        <Progress
                          labelPlacement="inside"
                          value={demo}
                          tone="success"
                          steps={32}
                          showValue
                        />
                      </Demo>
                    </div>

                    <Divider soft />

                    <div className="grid gap-x-6 gap-y-4 md:grid-cols-3">
                      <Demo label="steps 8">
                        <Progress value={demo} steps={8} />
                      </Demo>
                      <Demo label="steps 20">
                        <Progress value={demo} steps={20} />
                      </Demo>
                      <Demo label="steps 48">
                        <Progress value={demo} steps={48} />
                      </Demo>
                      <Demo label="info">
                        <Progress value={demo} tone="info" />
                      </Demo>
                      <Demo label="danger">
                        <Progress value={demo} tone="danger" />
                      </Demo>
                      <Demo label="indeterminate">
                        <Progress value={null} tone="info" />
                      </Demo>
                    </div>
                  </div>
                </Group>

                <Group title="Figures">
                  <div className="grid grid-cols-3 gap-4">
                    <Stat label="Balance" value="128,400" icon={<Coins />} hint="GC" />
                    <Stat
                      label="Players"
                      value="1/24"
                      icon={<Users />}
                      delta={{ value: "3", direction: "up" }}
                    />
                    <Stat
                      label="Uptime"
                      value="99.2%"
                      delta={{ value: "0.4%", direction: "down" }}
                    />
                  </div>
                  <Divider soft className="my-3" />
                  <DataRow label="Updated" value="August 11, 2026" />
                  <DataRow label="Network version" value="333402618" />
                  <DataRow label="Compatible CL" value="21454" />
                </Group>

                <Group title="Rows">
                  <div className="flex flex-col gap-1.5">
                    {players.map((player) => (
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
                        trailing={<Badge size="sm">{player.role}</Badge>}
                      />
                    ))}
                  </div>
                </Group>

                <Group title="Table" className="lg:col-span-2">
                  <DataTable
                    columns={columns}
                    rows={players}
                    rowKey={(row) => row.id}
                    selectedKey={selected}
                    onRowClick={(row) => setSelected(row.id)}
                    density="compact"
                    caption="Connected players"
                  />
                </Group>

                <Group title="Absent" hint="say why, and offer the way out">
                  <EmptyState
                    size="sm"
                    icon={<Package />}
                    title="No items"
                    description="Nothing has been placed here yet."
                    action={
                      <Button size="sm" variant="secondary">
                        Add item
                      </Button>
                    }
                  />
                </Group>

                <Group title="Pending" hint="holds the geometry of what loads">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-8 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-1/3" />
                      <Skeleton className="h-2.5 w-1/2" />
                    </div>
                    <Skeleton className="h-3 w-16" />
                  </div>
                </Group>
              </div>
            </TabPanel>

            {/* ----------------------------------------------- Overlays */}
            <TabPanel value="overlays" className="pt-5">
              <div className="grid gap-5 lg:grid-cols-2">
                <Group
                  title="Layers"
                  hint="all portalled — check they land above the panel"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Modal>
                      <ModalTrigger asChild>
                        <Button variant="secondary">Modal</Button>
                      </ModalTrigger>
                      <ModalContent
                        eyebrow="Confirm"
                        title="Leave world"
                        description="The session keeps running without you."
                        footer={
                          <>
                            <ModalClose asChild>
                              <Button variant="ghost">Stay</Button>
                            </ModalClose>
                            <ModalClose asChild>
                              <Button variant="danger" onClick={close}>
                                Leave
                              </Button>
                            </ModalClose>
                          </>
                        }
                      >
                        <p className="text-body text-text-muted">
                          Escape closes this dialog first, and only closes the
                          WebUI on a second press.
                        </p>
                      </ModalContent>
                    </Modal>

                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button variant="secondary">Drawer</Button>
                      </DrawerTrigger>
                      <DrawerContent
                        eyebrow="World"
                        title="Settings"
                        footer={
                          <>
                            <DrawerClose asChild>
                              <Button variant="ghost">Cancel</Button>
                            </DrawerClose>
                            <Button variant="primary">Apply</Button>
                          </>
                        }
                      >
                        <div className="flex flex-col gap-5">
                          <Field label="World name">
                            <Input defaultValue="Blank World" />
                          </Field>
                          <Field label="Master volume">
                            <Slider defaultValue={[80]} showValue />
                          </Field>
                          <Toggle defaultChecked label="Allow spectators" reversed />
                        </div>
                      </DrawerContent>
                    </Drawer>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="secondary">Popover</Button>
                      </PopoverTrigger>
                      <PopoverContent title="Anchored">
                        <div className="flex flex-col gap-3">
                          <p className="text-caption text-text-muted">
                            Positioned against its trigger and clamped to the
                            viewport.
                          </p>
                          <Slider defaultValue={[60]} showValue />
                        </div>
                      </PopoverContent>
                    </Popover>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <IconButton aria-label="More" icon={<Ellipsis />} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem icon={<Pencil />} shortcut="F2">
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem icon={<Gamepad2 />}>
                          Keybinds
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem icon={<Trash2 />} danger>
                          Delete draft
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Tooltip content="Preview world" keybind="V">
                      <IconButton aria-label="Preview" icon={<Eye />} />
                    </Tooltip>
                  </div>
                </Group>

                <Group title="Context menu" hint="right-click the target">
                  <ContextMenu>
                    <ContextMenuTrigger asChild>
                      <div className="grid h-16 place-items-center rounded-md border border-dashed border-line text-caption uppercase text-text-faint">
                        Right-click here
                      </div>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem icon={<Eye />}>Inspect</ContextMenuItem>
                      <ContextMenuSub label="Move to" icon={<Split />}>
                        <ContextMenuItem>Backpack</ContextMenuItem>
                        <ContextMenuItem>Storage</ContextMenuItem>
                        <ContextMenuItem disabled>Vehicle</ContextMenuItem>
                      </ContextMenuSub>
                      <ContextMenuSeparator />
                      <ContextMenuItem icon={<Trash2 />} danger>
                        Drop
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                </Group>

                <Group title="Toast" hint="opaque fill, tone on the edge">
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        toast({
                          title: "World saved",
                          description: "Blank World · v0.0",
                          tone: "success",
                        })
                      }
                    >
                      Success
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        toast({
                          title: "Upload failed",
                          description: "The server rejected the package.",
                          tone: "danger",
                          action: { label: "Retry", onClick: () => undefined },
                        })
                      }
                    >
                      With action
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        toast({
                          title: "Awaiting confirmation",
                          description: "Stays until dismissed.",
                          tone: "warning",
                          duration: 0,
                        })
                      }
                    >
                      Persistent
                    </Button>
                  </div>
                </Group>

                <Group title="Alert" hint="persistent, tied to its content">
                  <div className="flex flex-col gap-2">
                    <Alert tone="info" title="Closed alpha">
                      Publishing is limited to invited creators.
                    </Alert>
                    <Alert
                      tone="warning"
                      title="Version mismatch"
                      actions={
                        <Button size="sm" variant="secondary">
                          Update
                        </Button>
                      }
                    />
                    <Alert
                      tone="danger"
                      title="Connection lost"
                      onDismiss={() => undefined}
                    />
                  </div>
                </Group>
              </div>
            </TabPanel>

            {/* ------------------------------------------------- System */}
            <TabPanel value="system" className="pt-5">
              <div className="grid gap-5 lg:grid-cols-2">
                <Group title="Runtime">
                  <Panel tone="well" padding="md" className="flex flex-col gap-0.5">
                    <DataRow label="Renderer" value="CEF 128" />
                    <DataRow label="Package" value="gns-ui-harness" />
                    <DataRow label="Library" value="@gns/ui 0.1.0" />
                    <Divider soft className="my-2" />
                    <DataRow label="Toggle key" value="F10" />
                    <DataRow label="Dismiss" value="Esc" />
                  </Panel>
                </Group>

                <Group title="Lua round trip" hint="hEvent out, callback back">
                  <div className="flex flex-col gap-3">
                    <Button variant="secondary" icon={<Send />} onClick={ping}>
                      Send gnsui:ping
                    </Button>

                    {events.length === 0 ? (
                      <p className="text-caption text-text-disabled">
                        No traffic yet.
                      </p>
                    ) : (
                      <ul className="flex flex-col gap-1">
                        {events.map((event, index) => (
                          <li
                            key={`${event.text}-${index}`}
                            className={cn(
                              "flex items-center gap-2 rounded-sm bg-surface px-2 py-1",
                              "text-caption text-text-muted",
                            )}
                          >
                            {event.dir === "out" ? (
                              <ArrowUpRight
                                aria-hidden
                                className="size-3 shrink-0 text-info"
                              />
                            ) : (
                              <ArrowDownLeft
                                aria-hidden
                                className="size-3 shrink-0 text-success"
                              />
                            )}
                            <span className="truncate">{event.text}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </Group>

                <Group title="Transparency" className="lg:col-span-2">
                  <Alert tone="info" title="The page paints nothing of its own">
                    Only these panels have a fill. If the viewport goes black, a
                    background leaked into html, body or #root. If a panel
                    vanishes over bright terrain, it is using the white-alpha
                    surface ramp where it needs its own dark fill.
                  </Alert>
                </Group>
              </div>
            </TabPanel>
          </Tabs>
        </div>

        <footer className="flex items-center justify-between gap-4 border-t border-line px-5 py-3">
          <p className="text-caption text-text-faint">
            Press <Keybind size="sm">Esc</Keybind> or{" "}
            <Keybind size="sm">F10</Keybind> to close.
          </p>
          <Button variant="primary" size="sm" icon={<Play />} onClick={close}>
            Resume
          </Button>
        </footer>
      </Panel>
    </div>
  );
}
