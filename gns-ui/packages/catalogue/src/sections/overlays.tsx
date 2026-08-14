import { useState } from "react";
import {
  Alert,
  Button,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuTrigger,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Field,
  IconButton,
  Input,
  Modal,
  ModalClose,
  ModalContent,
  ModalTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Slider,
  Toggle,
  Tooltip,
  useToast,
} from "@gns/ui";
import {
  Copy,
  Ellipsis,
  Eye,
  LogOut,
  Pencil,
  Share2,
  Split,
  Trash2,
  Volume2,
} from "lucide-react";
import { Section, Spec } from "../Showcase";

export function Overlays() {
  const { toast } = useToast();
  const [volume, setVolume] = useState([70]);

  return (
    <Section
      id="overlays"
      title="Overlays & feedback"
      description="Transient surfaces, layered on a fixed scale so two packages never fight over stacking order. One blurred plane per screen."
    >
      <Spec
        title="Modal and drawer"
        note="A modal must be resolved before the screen underneath is usable again. A drawer runs alongside it."
      >
        <Modal>
          <ModalTrigger asChild>
            <Button variant="secondary">Open modal</Button>
          </ModalTrigger>
          <ModalContent
            eyebrow="Confirm"
            title="Leave world"
            description="Unsaved changes to the draft will be lost."
            footer={
              <>
                <ModalClose asChild>
                  <Button variant="ghost">Stay</Button>
                </ModalClose>
                <ModalClose asChild>
                  <Button variant="danger" icon={<LogOut />}>
                    Leave world
                  </Button>
                </ModalClose>
              </>
            }
          >
            <p className="text-body text-text-muted">
              You are about to disconnect from Blank World. Other players will
              keep the session running.
            </p>
          </ModalContent>
        </Modal>

        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="secondary">Open drawer</Button>
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
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  showValue
                  formatValue={(value) => `${value[0]}%`}
                />
              </Field>
              <Toggle defaultChecked label="Allow spectators" reversed />
              <Toggle label="Friendly fire" reversed />
            </div>
          </DrawerContent>
        </Drawer>
      </Spec>

      <Spec
        title="Tooltip and popover"
        note="A tooltip clarifies one control in a few words. A popover holds structure — fields, lists, actions."
      >
        <Tooltip content="Preview world" keybind="V">
          <IconButton aria-label="Preview" icon={<Eye />} />
        </Tooltip>

        <Tooltip content="Copy join code" side="bottom">
          <Button variant="secondary" icon={<Copy />}>
            Copy code
          </Button>
        </Tooltip>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary" icon={<Volume2 />}>
              Audio
            </Button>
          </PopoverTrigger>
          <PopoverContent title="Audio">
            <div className="flex flex-col gap-4">
              <Field label="Master">
                <Slider defaultValue={[80]} showValue />
              </Field>
              <Toggle defaultChecked label="Proximity voice" reversed />
            </div>
          </PopoverContent>
        </Popover>
      </Spec>

      <Spec
        title="Menus"
        note="Dropdowns hang off a control; context menus come from the object itself. Destructive entries sit last and carry the danger tone."
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IconButton aria-label="More actions" icon={<Ellipsis />} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>World</DropdownMenuLabel>
            <DropdownMenuItem icon={<Pencil />} shortcut="F2">
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem icon={<Share2 />}>Share</DropdownMenuItem>
            <DropdownMenuItem icon={<Copy />} shortcut="Ctrl">
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem icon={<Trash2 />} danger>
              Delete draft
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ContextMenu>
          <ContextMenuTrigger asChild>
            <div className="grid h-16 w-56 place-items-center rounded-md border border-dashed border-line text-caption uppercase text-text-faint">
              Right-click here
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuLabel>Item</ContextMenuLabel>
            <ContextMenuItem icon={<Eye />}>Inspect</ContextMenuItem>
            <ContextMenuSub label="Move to" icon={<Split />}>
              <ContextMenuItem>Backpack</ContextMenuItem>
              <ContextMenuItem>Storage</ContextMenuItem>
              <ContextMenuItem disabled>Vehicle (out of range)</ContextMenuItem>
            </ContextMenuSub>
            <ContextMenuSeparator />
            <ContextMenuItem icon={<Trash2 />} danger>
              Drop
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </Spec>

      <Spec
        title="Alert"
        note="Persistent, tied to the surrounding content, and it states the reason rather than relying on colour."
        stack
      >
        <Alert tone="info" title="Closed alpha">
          World publishing is limited to invited creators during the alpha.
        </Alert>
        <Alert tone="success" title="Draft saved" />
        <Alert
          tone="warning"
          title="Network version mismatch"
          actions={
            <Button size="sm" variant="secondary">
              Update
            </Button>
          }
        >
          This draft targets CL 21454; the client is running 21460.
        </Alert>
        <Alert tone="danger" title="Connection lost" onDismiss={() => undefined}>
          The session ended unexpectedly. Reconnect to resume editing.
        </Alert>
      </Spec>

      <Spec
        title="Toast"
        note="Transient and unrelated to what the player is looking at. The draining rule shows the time left without a countdown."
      >
        <Button
          variant="secondary"
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
          onClick={() =>
            toast({
              title: "Awaiting confirmation",
              description: "This one stays until dismissed.",
              tone: "warning",
              duration: 0,
            })
          }
        >
          Persistent
        </Button>
      </Spec>
    </Section>
  );
}
