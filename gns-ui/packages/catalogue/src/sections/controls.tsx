import { useState } from "react";
import {
  Badge,
  Button,
  Checkbox,
  Chip,
  Field,
  Form,
  FormField,
  FormMessage,
  FormReset,
  FormSubmit,
  IconButton,
  Input,
  Keybind,
  NumberStepper,
  Radio,
  RadioGroup,
  Segmented,
  Select,
  Slider,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Textarea,
  Toggle,
  useForm,
  type FormResult,
} from "@gns/ui";
import {
  Boxes,
  Coins,
  FileText,
  Gamepad2,
  Grid2x2,
  List,
  LogOut,
  Play,
  Search,
  Settings,
  Star,
  Trash2,
  Users,
} from "lucide-react";
import { Section, Spec, Variant } from "../Showcase";

/**
 * Stands in for a Lua handler. The delay is deliberate: it is the only way to
 * see the submit button's loading state, which is otherwise invisible.
 */
async function fakeServer(values: {
  displayName: string;
  region: string;
}): Promise<FormResult> {
  await new Promise((resolve) => setTimeout(resolve, 700));

  const errors: Record<string, string> = {};
  if (values.displayName.trim().length < 3) {
    errors.displayName = "Must be at least 3 characters.";
  } else if (values.displayName.trim().toLowerCase() === "taken") {
    errors.displayName = "That name is already in use.";
  }
  if (values.region === "banned") {
    errors.region = "That region is not accepting connections.";
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, message: "Profile saved." };
}

export function Controls() {
  const [quantity, setQuantity] = useState(3);
  const demoForm = useForm({
    initialValues: { displayName: "MS Studios", region: "eu-west" },
    onSubmit: fakeServer,
  });
  const [volume, setVolume] = useState([65]);
  const [range, setRange] = useState([20, 80]);
  const [view, setView] = useState("grid");
  const [density, setDensity] = useState("default");
  const [filters, setFilters] = useState<string[]>(["weapons"]);
  const [agreed, setAgreed] = useState(true);
  const [voice, setVoice] = useState(true);

  const toggleFilter = (id: string) =>
    setFilters((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );

  return (
    <Section
      id="controls"
      title="Controls"
      description="Everything the player acts through. Each control ships its default, hover, focus, active and disabled treatment — screens do not restyle them to make a point."
    >
      <Spec
        title="Button"
        note="One primary per context. Secondary is the everyday choice; ghost keeps low-priority actions from competing for attention. The clipped bottom-right corner is the client's own mark for actionable chrome — pass chamfer={false} on the rare control that should not carry it."
        stack
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" icon={<Play />}>
            Resume
          </Button>
          <Button variant="secondary" icon={<Settings />}>
            Settings
          </Button>
          <Button variant="subtle">Subtle</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger" icon={<LogOut />}>
            Leave world
          </Button>
          <Button variant="danger-ghost" icon={<Trash2 />}>
            Delete
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Variant label="xs">
            <Button size="xs">Action</Button>
          </Variant>
          <Variant label="sm">
            <Button size="sm">Action</Button>
          </Variant>
          <Variant label="md">
            <Button size="md">Action</Button>
          </Variant>
          <Variant label="lg">
            <Button size="lg">Action</Button>
          </Variant>
          <Variant label="loading">
            <Button variant="primary" loading>
              Saving
            </Button>
          </Variant>
          <Variant label="disabled">
            <Button disabled>Unavailable</Button>
          </Variant>
          <Variant label="icon only">
            <div className="flex gap-2">
              <IconButton aria-label="Search" icon={<Search />} />
              <IconButton
                aria-label="Favourite"
                variant="ghost"
                icon={<Star />}
              />
              <IconButton
                aria-label="Delete"
                variant="danger"
                icon={<Trash2 />}
              />
            </div>
          </Variant>
        </div>
      </Spec>

      <Spec
        title="Chip, badge, keybind"
        note="Chips are selectable and can be removed. Badges only report state. Keybinds mirror the caps the client draws next to an action."
        stack
      >
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
          <Badge tone="signal" size="lg" pill>
            Epic
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Keybind>Q</Keybind>
          <Keybind>E</Keybind>
          <Keybind>F10</Keybind>
          <Keybind pressed>Shift</Keybind>
          <span className="text-caption text-text-faint">
            Hold <Keybind size="sm">E</Keybind> to interact
          </span>
        </div>
      </Spec>

      <Spec
        title="Text fields"
        note="Field wires up the label, description and error for you, so validation never rides on border colour alone."
        stack
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Display name" hint="Visible to other players.">
            <Input placeholder="Enter a name" defaultValue="MS Studios" />
          </Field>

          <Field label="Search" >
            <Input placeholder="Filter items" prefix={<Search />} />
          </Field>

          <Field
            label="Transfer amount"
            error="Insufficient balance for this transfer."
            required
          >
            <Input defaultValue="12500" prefix={<Coins />} suffix="GC" />
          </Field>

          <Field label="Disabled">
            <Input defaultValue="Locked value" disabled />
          </Field>
        </div>

        <Field
          label="World description"
          hint="Shown on the world details panel."
          aside="0/240"
        >
          <Textarea placeholder="Describe the world" rows={3} />
        </Field>
      </Spec>

      <Spec
        title="Select"
        note="A single choice from a known list. Long lists scroll inside the menu rather than growing past the viewport."
      >
        <Field label="Region" className="w-56">
          <Select
            defaultValue="eu-west"
            options={[
              { value: "eu-west", label: "EU West", icon: <Gamepad2 /> },
              { value: "eu-north", label: "EU North", icon: <Gamepad2 /> },
              { value: "na-east", label: "NA East", icon: <Gamepad2 /> },
              { value: "sa", label: "South America", disabled: true },
            ]}
          />
        </Field>

        <Field label="Sort by" className="w-56">
          <Select
            placeholder="Choose"
            options={[
              { value: "updated", label: "Last updated" },
              { value: "players", label: "Player count" },
              { value: "rating", label: "Rating" },
            ]}
          />
        </Field>
      </Spec>

      <Spec
        title="Selection controls"
        note="Toggles apply immediately. Checkboxes belong in a form that is submitted."
        stack
      >
        <div className="grid gap-5 sm:grid-cols-3">
          <div className="flex flex-col gap-3">
            <Checkbox
              checked={agreed}
              onCheckedChange={(next) => setAgreed(next === true)}
              label="Allow spectators"
              description="Anyone can watch this world."
            />
            <Checkbox checked="indeterminate" label="Partial selection" />
            <Checkbox disabled label="Locked by server" />
          </div>

          <RadioGroup defaultValue="everyone">
            <Radio
              value="everyone"
              label="Everyone"
              description="No age restriction."
            />
            <Radio value="teen" label="Teen" />
            <Radio value="mature" label="Mature" />
          </RadioGroup>

          <div className="flex flex-col gap-3">
            <Toggle
              checked={voice}
              onCheckedChange={setVoice}
              label="Proximity voice"
              description="Voice fades with distance."
            />
            <Toggle defaultChecked={false} label="Friendly fire" />
            <Toggle disabled label="Developer mode" />
          </div>
        </div>
      </Spec>

      <Spec
        title="Numeric input"
        note="Sliders for continuous values, steppers for counts that must land on an exact number. The handle is a bar overhanging a squared track, and ticks give the eye something to measure against when the extremes are not self-evident."
        stack
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Master volume">
            <Slider
              value={volume}
              onValueChange={setVolume}
              showValue
              formatValue={(value) => `${value[0]}%`}
            />
          </Field>

          <Field label="Player range">
            <Slider value={range} onValueChange={setRange} showValue />
          </Field>

          <Field label="Field of view" hint="Ticks at every 10 degrees.">
            <Slider
              defaultValue={[90]}
              min={60}
              max={120}
              step={5}
              ticks={6}
              showValue
              formatValue={(value) => `${value[0]}°`}
            />
          </Field>

          <Field label="Disabled">
            <Slider defaultValue={[40]} disabled showValue />
          </Field>
        </div>

        <Field label="Quantity">
          <NumberStepper
            value={quantity}
            onValueChange={setQuantity}
            min={1}
            max={64}
            unit="pcs"
          />
        </Field>
      </Spec>

      <Spec
        title="Form"
        note="State, per-field errors and submission status. The server owns validation — the screen sends what was typed and renders the verdict, because only the server knows whether a name is taken. In game, onSubmit is submitTo('event') from @gns/helix; here it is a stub that rejects a couple of values."
        stack
      >
        <Form form={demoForm} className="max-w-xl">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              name="displayName"
              label="Display name"
              hint="Try 'taken' to see a server rejection."
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
                    { value: "na-east", label: "NA East" },
                    { value: "banned", label: "Restricted region" },
                  ]}
                />
              )}
            </FormField>
          </div>

          <FormMessage successText="The server accepted the profile." />

          <div className="flex items-center justify-end gap-2">
            <FormReset>Reset</FormReset>
            <FormSubmit requireDirty>Save profile</FormSubmit>
          </div>
        </Form>
      </Spec>

      <Spec
        title="Tabs and segments"
        note="Tabs switch a whole view. Segments switch how one view is rendered."
        stack
      >
        <Tabs defaultValue="overview">
          <TabList
            aside={
              <div className="flex items-center gap-1 pb-2">
                <Keybind size="sm">Q</Keybind>
                <Keybind size="sm">E</Keybind>
              </div>
            }
          >
            <Tab value="overview" icon={<FileText />}>
              Overview
            </Tab>
            <Tab value="players" icon={<Users />}>
              Players
            </Tab>
            <Tab value="keybinds" icon={<Gamepad2 />}>
              Keybinds
            </Tab>
            <Tab value="rating" icon={<Star />}>
              Rating
            </Tab>
          </TabList>

          <TabPanel value="overview" className="pt-4 text-body text-text-muted">
            Welcome to Blank World.
          </TabPanel>
          <TabPanel value="players" className="pt-4 text-body text-text-muted">
            One player connected.
          </TabPanel>
          <TabPanel value="keybinds" className="pt-4 text-body text-text-muted">
            No custom bindings.
          </TabPanel>
          <TabPanel value="rating" className="pt-4 text-body text-text-muted">
            Not yet rated.
          </TabPanel>
        </Tabs>

        <div className="flex flex-wrap items-center gap-4">
          <Segmented
            aria-label="View"
            value={view}
            onValueChange={setView}
            options={[
              { value: "grid", label: "Grid", icon: <Grid2x2 /> },
              { value: "list", label: "List", icon: <List /> },
              { value: "slots", label: "Slots", icon: <Boxes /> },
            ]}
          />
          <Segmented
            aria-label="Density"
            size="sm"
            value={density}
            onValueChange={setDensity}
            options={[
              { value: "default", label: "Default" },
              { value: "compact", label: "Compact" },
            ]}
          />
        </div>
      </Spec>
    </Section>
  );
}
