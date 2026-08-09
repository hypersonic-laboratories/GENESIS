(function () {
    "use strict";

    var components = [
        {
            id: "sg-button",
            name: "Button",
            icon: "hand",
            category: "Actions",
            summary: "Primary, secondary, tertiary, ghost, and semantic actions with one browser-native activation event.",
            description: "Action primitive",
            keywords: "action click submit confirm loading disabled keyboard sg-activate",
            stageNote: "Activate the specimen to inspect sg-activate",
            defaults: { variant: "primary", size: "md", disabled: false, loading: false },
            controls: [
                { key: "variant", label: "Variant", type: "choice", options: [["primary", "Primary"], ["secondary", "Secondary"], ["tertiary", "Tertiary"], ["ghost", "Ghost"], ["success", "Success"], ["warning", "Warning"], ["danger", "Danger"]] },
                { key: "size", label: "Size", type: "choice", options: [["sm", "Small"], ["md", "Medium"], ["lg", "Large"]] },
                { key: "loading", label: "Loading", type: "boolean" },
                { key: "disabled", label: "Disabled", type: "boolean" }
            ],
            attributes: [
                ["variant", "primary | secondary | tertiary | ghost | success | warning | danger", "Visual priority; secondary is the default treatment."],
                ["size", "sm | md | lg", "Medium is the default."],
                ["loading", "boolean", "Blocks activation and exposes aria-busy."],
                ["disabled", "boolean", "Removes the element from the tab order."]
            ],
            events: [["sg-activate", "{ source: 'keyboard' | 'pointer' }", "Bubbles and crosses component boundaries."]],
            a11y: ["Receives role=button and keyboard activation for Enter and Space.", "Loading and disabled states expose aria-disabled; loading also exposes aria-busy.", "Supply visible action text. Icon-only controls need an explicit accessible label."],
            render: renderButton,
            markup: buttonMarkup
        },
        {
            id: "sg-icon-button",
            name: "Icon button",
            icon: "settings",
            category: "Actions",
            summary: "A compact labeled action for toolbar, dismiss, and utility controls with optional pressed state.",
            description: "Compact action primitive",
            keywords: "icon button toolbar utility action label pressed loading disabled keyboard sg-activate",
            stageNote: "The visible icon is decorative; the label supplies the control name",
            defaults: { icon: "settings", variant: "secondary", size: "md", pressed: false, loading: false, disabled: false },
            controls: [
                { key: "icon", label: "Action", type: "choice", options: [["settings", "Settings"], ["search", "Search"], ["x", "Close"], ["plus", "Add"]] },
                { key: "variant", label: "Variant", type: "choice", options: [["secondary", "Secondary"], ["primary", "Primary"], ["ghost", "Ghost"], ["danger", "Danger"]] },
                { key: "size", label: "Size", type: "choice", options: [["sm", "Small"], ["md", "Medium"], ["lg", "Large"]] },
                { key: "pressed", label: "Pressed", type: "boolean" },
                { key: "loading", label: "Loading", type: "boolean" },
                { key: "disabled", label: "Disabled", type: "boolean" }
            ],
            attributes: [
                ["icon", "sprite symbol name", "Required bundled icon displayed inside the control."],
                ["label", "string", "Required accessible action name."],
                ["variant", "primary | secondary | ghost | danger", "Visual priority; secondary is the default treatment."],
                ["size", "sm | md | lg", "Square geometry follows the shared control-height scale."],
                ["pressed", "boolean", "Exposes a persistent on/off action with aria-pressed."],
                ["loading", "boolean", "Blocks activation and exposes aria-busy."],
                ["disabled", "boolean", "Blocks activation and removes the control from the tab order."]
            ],
            events: [["sg-activate", "{ source: 'keyboard' | 'pointer' }", "Bubbles for pointer, Enter, and Space activation."]],
            a11y: ["The label attribute is required because the icon does not provide the control name.", "Pressed state is reserved for persistent toggled actions, not momentary commands such as close or delete.", "Loading and disabled states block activation while preserving a readable accessible name."],
            render: renderIconButton,
            markup: iconButtonMarkup
        },
        {
            id: "sg-input",
            name: "Input",
            icon: "search",
            category: "Forms",
            summary: "A labeled native text field with clear hint, validation, read-only, and disabled contracts.",
            description: "Text entry primitive",
            keywords: "input field text search password validation required readonly disabled invalid hint error sg-input sg-change",
            stageNote: "Edit the field to inspect live sg-input and committed sg-change payloads",
            defaults: { type: "text", required: false, invalid: false, readonly: false, disabled: false },
            controls: [
                { key: "type", label: "Input type", type: "choice", options: [["text", "Text"], ["search", "Search"], ["password", "Password"], ["number", "Number"]] },
                { key: "required", label: "Required", type: "boolean" },
                { key: "invalid", label: "Invalid", type: "boolean" },
                { key: "readonly", label: "Read only", type: "boolean" },
                { key: "disabled", label: "Disabled", type: "boolean" }
            ],
            attributes: [
                ["label", "string", "Required visible field label."],
                ["value / name", "string", "Current value and form-compatible field name."],
                ["type", "text | search | password | number", "Native input type; text is the default."],
                ["placeholder / autocomplete / inputmode", "string", "Native text-entry hints forwarded to the internal input."],
                ["min / max / step", "number", "Native numeric constraints when the chosen type supports them."],
                ["minlength / maxlength / pattern", "number | string", "Native text validation constraints."],
                ["hint / error", "string", "Supporting guidance or a recoverable validation message."],
                ["required / readonly / disabled / invalid", "boolean", "Explicit field and validation states."]
            ],
            events: [
                ["sg-input", "{ value: string, name: string }", "Bubbles on every user-authored value update."],
                ["sg-change", "{ value: string, name: string }", "Bubbles when the native field commits its value."]
            ],
            a11y: ["The visible label is programmatically associated with the internal native input.", "Invalid fields expose aria-invalid and connect their error text through aria-describedby.", "Placeholder text never replaces the visible label; disabled and read-only remain visually distinct."],
            render: renderInput,
            markup: inputMarkup
        },
        {
            id: "sg-select",
            name: "Select",
            icon: "users",
            category: "Forms",
            summary: "A labeled native option picker for script-owned lists, with single and multiple selection contracts.",
            description: "Option selection primitive",
            keywords: "select dropdown options value multiple required disabled invalid hint error sg-input sg-change",
            stageNote: "Options remain caller-owned native markup and values remain script-owned state",
            defaults: { value: "patrol", required: false, multiple: false, invalid: false, disabled: false },
            controls: [
                { key: "value", label: "Selected channel", type: "choice", options: [["dispatch", "Dispatch"], ["patrol", "Patrol 1"], ["tactical", "Tactical"]] },
                { key: "required", label: "Required", type: "boolean" },
                { key: "multiple", label: "Multiple", type: "boolean" },
                { key: "invalid", label: "Invalid", type: "boolean" },
                { key: "disabled", label: "Disabled", type: "boolean" }
            ],
            attributes: [
                ["label", "string", "Required visible field label."],
                ["value / name", "string", "Selected value and form-compatible field name."],
                ["placeholder", "string", "Optional prompt shown before a valid selection."],
                ["multiple / size", "boolean | number", "Enables native multi-select behavior and visible row count."],
                ["hint / error", "string", "Supporting guidance or a recoverable validation message."],
                ["required / disabled / invalid", "boolean", "Explicit availability and validation states."]
            ],
            events: [
                ["sg-input", "{ value: string, values: string[], name: string }", "Bubbles as the native selection changes."],
                ["sg-change", "{ value: string, values: string[], name: string }", "Bubbles when the native selection commits."]
            ],
            a11y: ["Caller-supplied option elements retain native keyboard and assistive-technology behavior.", "The visible label is programmatically associated with the internal select.", "Invalid state is announced with linked error text; selection never relies on color alone."],
            render: renderSelect,
            markup: selectMarkup
        },
        {
            id: "sg-toggle",
            name: "Toggle",
            icon: "radio",
            category: "Forms",
            summary: "A labeled binary setting with an explicit checked value and one committed state-change event.",
            description: "Binary setting primitive",
            keywords: "toggle switch checked setting disabled label hint sg-change",
            stageNote: "Use toggles for settings that take effect immediately, not for form submission actions",
            defaults: { checked: true, disabled: false },
            controls: [
                { key: "checked", label: "Checked", type: "boolean" },
                { key: "disabled", label: "Disabled", type: "boolean" }
            ],
            attributes: [
                ["label", "string", "Required visible setting name."],
                ["checked", "boolean", "Reflects caller-owned on/off state."],
                ["name / value", "string", "Form-compatible field name and submitted value."],
                ["hint", "string", "Optional supporting explanation."],
                ["disabled", "boolean", "Blocks interaction and removes the control from the tab order."]
            ],
            events: [["sg-change", "{ checked: boolean, value: string, name: string }", "Bubbles with the requested next state after user interaction."]],
            a11y: ["Uses native checkbox semantics and exposes the checked state programmatically.", "The visible label names the setting; hint text adds context without replacing it.", "The consuming script should update the checked attribute when server-authoritative state is confirmed."],
            render: renderToggle,
            markup: toggleMarkup
        },
        {
            id: "sg-slider",
            name: "Slider",
            icon: "radio",
            category: "Forms",
            summary: "A bounded native range control with aligned numeric output, units, and live and committed value events.",
            description: "Range input primitive",
            keywords: "slider range min max step value unit show value disabled sg-input sg-change volume",
            stageNote: "Comparable values use a stable unit while the native range retains keyboard control",
            defaults: { value: "65", showValue: true, disabled: false },
            controls: [
                { key: "value", label: "Radio volume", type: "choice", options: [["25", "25%"], ["65", "65%"], ["100", "100%"]] },
                { key: "showValue", label: "Show value", type: "boolean" },
                { key: "disabled", label: "Disabled", type: "boolean" }
            ],
            attributes: [
                ["label", "string", "Required visible measurement name."],
                ["value", "number", "Current caller-owned numeric value."],
                ["min / max / step", "number", "Native range bounds and increment."],
                ["name", "string", "Form-compatible field name included in event detail."],
                ["unit", "string", "Short visible suffix such as %, m, or kg."],
                ["show-value", "boolean", "Displays the aligned current value beside the label."],
                ["hint", "string", "Optional supporting explanation."],
                ["disabled", "boolean", "Blocks interaction and removes the control from the tab order."]
            ],
            events: [
                ["sg-input", "{ value: number, name: string }", "Bubbles for continuous user-authored range updates."],
                ["sg-change", "{ value: number, name: string }", "Bubbles when the native range commits its value."]
            ],
            a11y: ["The native range input retains arrow-key, Home, End, and assistive-technology behavior.", "The visible label is programmatically associated with the slider.", "When show-value is omitted, another visible or contextual reading should communicate the current value."],
            render: renderSlider,
            markup: sliderMarkup
        },
        {
            id: "sg-tabs",
            name: "Tabs",
            icon: "layers",
            category: "Navigation",
            summary: "A native-button tablist with caller-owned panels, automatic keyboard selection, and one state-change event.",
            description: "Section navigation primitive",
            keywords: "tabs tablist panels navigation orientation keyboard value sg-change",
            stageNote: "Arrow keys move and select; the consuming script owns panel content",
            defaults: { value: "inventory", orientation: "horizontal" },
            controls: [
                { key: "value", label: "Selected tab", type: "choice", options: [["overview", "Overview"], ["inventory", "Inventory"], ["settings", "Settings"]] },
                { key: "orientation", label: "Orientation", type: "choice", options: [["horizontal", "Horizontal"], ["vertical", "Vertical"]] }
            ],
            attributes: [
                ["value", "string", "Selected caller-owned tab value."],
                ["orientation", "horizontal | vertical", "Changes layout and the relevant arrow-key axis."],
                ["data-sg-tab / value", "button hooks", "Marks each native tab button and its stable value."],
                ["data-sg-panel / value", "panel hooks", "Associates caller-owned content with the matching tab value."]
            ],
            events: [["sg-change", "{ value: string, previousValue: string }", "Bubbles when pointer or keyboard interaction selects another tab."]],
            a11y: ["Uses native buttons with tab, tablist, and tabpanel semantics.", "Arrow keys, Home, and End move focus and selection without trapping Tab navigation.", "Disabled tabs are skipped and every panel is programmatically associated with its tab."],
            render: renderTabs,
            markup: tabsMarkup
        },
        {
            id: "sg-segmented",
            name: "Segmented control",
            icon: "columns-3",
            category: "Navigation",
            summary: "A compact single-choice control for view, time-range, and mode switches that take effect immediately.",
            description: "Immediate mode primitive",
            keywords: "segmented radio group view mode size full width disabled keyboard sg-change",
            stageNote: "Use for closely related modes, not unrelated actions",
            defaults: { value: "grid", size: "md", fullWidth: false, disabled: false },
            controls: [
                { key: "value", label: "View mode", type: "choice", options: [["list", "List"], ["grid", "Grid"], ["tiles", "Tiles"]] },
                { key: "size", label: "Size", type: "choice", options: [["sm", "Small"], ["md", "Medium"], ["lg", "Large"]] },
                { key: "fullWidth", label: "Full width", type: "boolean" },
                { key: "disabled", label: "Disabled", type: "boolean" }
            ],
            attributes: [
                ["value", "string", "Selected caller-owned option value."],
                ["label", "string", "Accessible name for the option group."],
                ["size", "sm | md | lg", "Shared control-height scale."],
                ["full-width / disabled", "boolean", "Equal-width layout and explicit unavailable state."]
            ],
            events: [["sg-change", "{ value: string, previousValue: string }", "Bubbles when the selected mode changes."]],
            a11y: ["Uses a named radiogroup with native buttons and programmatic checked state.", "All arrow keys, Home, and End move focus and selection.", "The control communicates selection through position, fill, and aria-checked rather than color alone."],
            render: renderSegmented,
            markup: segmentedMarkup
        },
        {
            id: "sg-modal",
            name: "Modal",
            icon: "square-stack",
            category: "Overlays",
            summary: "A protected dialog shell with cancelable dismissal, focus trapping, Escape handling, and focus restoration.",
            description: "Blocking task shell",
            keywords: "modal dialog overlay open dismissible size close escape focus trap scrim sg-close",
            stageNote: "Open the specimen, then test Tab, Shift+Tab, Escape, and restored focus",
            defaults: { size: "md", dismissible: true },
            controls: [
                { key: "size", label: "Size", type: "choice", options: [["sm", "Small"], ["md", "Medium"], ["lg", "Large"]] },
                { key: "dismissible", label: "Dismissible", type: "boolean" }
            ],
            attributes: [
                ["open", "boolean", "Displays the dialog and activates protected focus behavior."],
                ["label", "string", "Visible dialog title and accessible name."],
                ["size", "sm | md | lg", "Constrains the dialog surface width."],
                ["dismissible", "boolean", "Enables close button, Escape, and scrim dismissal."]
            ],
            events: [["sg-close", "{ reason: 'close-button' | 'escape' | 'scrim' }", "Cancelable. Default behavior removes open and restores prior focus."]],
            a11y: ["Uses role=dialog and aria-modal with a visible programmatic title.", "Tab remains inside the open dialog and focus returns to the opener after closure.", "Non-dismissible dialogs require an explicit caller-owned resolution action inside their content."],
            render: renderModal,
            markup: modalMarkup
        },
        {
            id: "sg-drawer",
            name: "Drawer",
            icon: "panel-right",
            category: "Overlays",
            summary: "A left or right secondary-workflow shell with cancelable dismissal and the same focus guarantees as a modal.",
            description: "Secondary workflow shell",
            keywords: "drawer panel overlay open side size dismissible close focus escape scrim sg-close",
            stageNote: "Drawers preserve the underlying screen while containing one secondary workflow",
            defaults: { side: "right", size: "md", dismissible: true },
            controls: [
                { key: "side", label: "Side", type: "choice", options: [["right", "Right"], ["left", "Left"]] },
                { key: "size", label: "Size", type: "choice", options: [["sm", "Small"], ["md", "Medium"], ["lg", "Large"]] },
                { key: "dismissible", label: "Dismissible", type: "boolean" }
            ],
            attributes: [
                ["open", "boolean", "Displays the drawer and activates protected focus behavior."],
                ["label", "string", "Visible drawer title and accessible name."],
                ["side", "left | right", "Physical edge from which the drawer enters."],
                ["size", "sm | md | lg", "Constrains drawer width."],
                ["dismissible", "boolean", "Enables close button, Escape, and scrim dismissal."]
            ],
            events: [["sg-close", "{ reason: 'close-button' | 'escape' | 'scrim' }", "Cancelable. Default behavior removes open and restores prior focus."]],
            a11y: ["Uses dialog semantics because the open drawer temporarily owns keyboard focus.", "Tab and Shift+Tab remain inside until the workflow closes.", "The side changes placement only; reading and focus order remain logical."],
            render: renderDrawer,
            markup: drawerMarkup
        },
        {
            id: "sg-tooltip",
            name: "Tooltip",
            icon: "message-square",
            category: "Overlays",
            summary: "A concise hover-and-focus clarification attached to a caller-owned interactive trigger.",
            description: "Control clarification primitive",
            keywords: "tooltip hover focus content placement top bottom left right disabled aria describedby",
            stageNote: "Hover or focus the icon; tooltips never contain actions",
            defaults: { placement: "top", disabled: false },
            controls: [
                { key: "placement", label: "Placement", type: "choice", options: [["top", "Top"], ["right", "Right"], ["bottom", "Bottom"], ["left", "Left"]] },
                { key: "disabled", label: "Disabled", type: "boolean" }
            ],
            attributes: [
                ["content", "string", "Short clarification associated with the trigger through aria-describedby."],
                ["placement", "top | right | bottom | left", "Preferred position relative to the trigger."],
                ["disabled", "boolean", "Suppresses display and the described-by relationship."]
            ],
            events: [],
            a11y: ["Appears for both hover and keyboard focus.", "The content supplements rather than replaces the trigger's accessible name.", "Structured information or actions belong in a popover or drawer, never inside a tooltip."],
            render: renderTooltip,
            markup: tooltipMarkup
        },
        {
            id: "sg-toast",
            name: "Toast",
            icon: "bell",
            category: "Feedback",
            summary: "Compact transient feedback with semantic tone, optional timeout, pause-on-interaction, and cancelable dismissal.",
            description: "Transient feedback primitive",
            keywords: "toast notification transient duration timeout dismissible urgent tone stack sg-dismiss",
            stageNote: "Dismiss the specimen or use Show toast to replay it",
            defaults: { tone: "success", duration: "0", dismissible: true, urgent: false },
            controls: [
                { key: "tone", label: "Tone", type: "choice", options: [["info", "Information"], ["success", "Success"], ["warning", "Warning"], ["danger", "Danger"]] },
                { key: "duration", label: "Duration", type: "choice", options: [["0", "Persistent demo"], ["5000", "5 seconds"]] },
                { key: "dismissible", label: "Dismissible", type: "boolean" },
                { key: "urgent", label: "Urgent announcement", type: "boolean" }
            ],
            attributes: [
                ["tone", "info | success | warning | danger", "Semantic visual treatment."],
                ["title", "string", "Optional heading; a tone-aware default is supplied."],
                ["duration", "milliseconds", "Positive values auto-dismiss; zero leaves lifecycle to the script."],
                ["dismissible / urgent", "boolean", "Adds manual dismissal and opt-in role=alert announcement."]
            ],
            events: [["sg-dismiss", "{ reason: 'dismiss-button' | 'timeout' }", "Cancelable. Default behavior hides the toast."]],
            a11y: ["Defaults to role=status; urgent is reserved for genuinely time-sensitive feedback.", "Hover or keyboard focus pauses timed dismissal so the message remains readable.", "Consumer-owned .sg-toast-stack regions prevent multiple messages from overlapping."],
            render: renderToast,
            markup: toastMarkup
        },
        {
            id: "sg-stat",
            name: "Status readout",
            icon: "heart",
            category: "HUD",
            summary: "A compact label, value, optional detail, icon, and meaningful progress reading for targeted script updates.",
            description: "Operational readout",
            keywords: "status hud stat health armor progress value targeted update",
            stageNote: "Only meaningful progress values receive progress semantics",
            defaults: { tone: "blue", progress: "75", detail: true },
            controls: [
                { key: "tone", label: "Signal tone", type: "choice", options: [["default", "Cyan"], ["blue", "Blue"], ["success", "Success"], ["warning", "Warning"], ["danger", "Danger"], ["violet", "Violet"]] },
                { key: "progress", label: "Progress", type: "choice", options: [["none", "None"], ["25", "25%"], ["48", "48%"], ["75", "75%"], ["100", "100%"]] },
                { key: "detail", label: "Supporting detail", type: "boolean" }
            ],
            attributes: [
                ["label", "string", "Required visible measurement label."],
                ["value", "string", "Primary script-supplied value."],
                ["detail", "string", "Optional supporting context."],
                ["icon", "icon name", "Optional decorative system icon."],
                ["progress", "0–100", "Optional; use only for a real bounded measure."],
                ["tone", "blue | success | warning | danger | violet", "Semantic signal color."]
            ],
            events: [],
            a11y: ["Exposes a grouped accessible label combining label and value.", "Progress semantics are created only when the progress attribute exists.", "Do not use color alone to communicate a threshold; the value and label remain visible."],
            render: renderStat,
            markup: statMarkup
        },
        {
            id: "sg-item-slot",
            name: "Item slot",
            icon: "backpack",
            category: "Inventory",
            summary: "Caller-owned item media inside consistent selected, rarity, locked, disabled, and empty geometry.",
            description: "Inventory primitive",
            keywords: "inventory item slot rarity selected locked empty disabled sg-item-activate",
            stageNote: "Selection is emitted; the consuming script owns the final state",
            defaults: { rarity: "rare", selected: true, locked: false, empty: false },
            controls: [
                { key: "rarity", label: "Rarity", type: "choice", options: [["default", "Common"], ["uncommon", "Uncommon"], ["rare", "Rare"], ["epic", "Epic"], ["legendary", "Legendary"]] },
                { key: "selected", label: "Selected", type: "boolean" },
                { key: "locked", label: "Locked", type: "boolean" },
                { key: "empty", label: "Empty", type: "boolean" }
            ],
            attributes: [
                ["label", "string", "Visible and accessible item name."],
                ["quantity", "string", "Stack count, including its display suffix."],
                ["meta", "string", "Weight or caller-owned secondary value."],
                ["rarity", "uncommon | rare | epic | legendary", "Adds a canonical rarity signal."],
                ["selected", "boolean", "Reflects caller-owned selection."],
                ["locked / disabled / empty", "boolean", "Explicit availability states."]
            ],
            events: [["sg-item-activate", "{ label: string, selected: boolean }", "Requests the next selected state; the script decides whether to apply it."]],
            a11y: ["Uses button semantics and exposes selected state with aria-pressed.", "Locked and disabled slots leave the tab order and expose their state in the accessible label.", "Quantity and item state are included in the accessible name; caller media may remain decorative."],
            render: renderItem,
            markup: itemMarkup
        },
        {
            id: "sg-alert",
            name: "Alert",
            icon: "info",
            category: "Feedback",
            summary: "Persistent contextual feedback with semantic tone, optional dismissal, and opt-in urgent announcement.",
            description: "Feedback primitive",
            keywords: "alert banner notification success warning danger dismiss urgent sg-dismiss",
            stageNote: "Dismissal is cancelable before default hiding occurs",
            defaults: { tone: "warning", dismissible: true, urgent: false },
            controls: [
                { key: "tone", label: "Tone", type: "choice", options: [["info", "Information"], ["success", "Success"], ["warning", "Warning"], ["danger", "Danger"]] },
                { key: "dismissible", label: "Dismissible", type: "boolean" },
                { key: "urgent", label: "Urgent announcement", type: "boolean" }
            ],
            attributes: [
                ["tone", "info | success | warning | danger", "Semantic visual treatment."],
                ["title", "string", "Optional heading; a tone-aware default is supplied."],
                ["dismissible", "boolean", "Adds an accessible dismiss control."],
                ["urgent", "boolean", "Opts into role=alert; default role is status."]
            ],
            events: [["sg-dismiss", "{ reason: 'dismiss-button' }", "Cancelable. Default behavior hides the alert."]],
            a11y: ["Defaults to role=status so routine messages do not interrupt assistive technology.", "Use urgent only when immediate announcement is genuinely required.", "The dismiss control has an accessible label and visible focus treatment."],
            render: renderAlert,
            markup: alertMarkup
        },
        {
            id: "sg-badge",
            name: "Badge",
            icon: "circle-check",
            category: "Status",
            summary: "Compact, non-interactive labels for roles, rarity, state, and short semantic metadata.",
            description: "Metadata primitive",
            keywords: "badge pill label role rarity status filled outline semantic",
            stageNote: "Badges label state; they do not masquerade as controls",
            defaults: { tone: "info", appearance: "soft" },
            controls: [
                { key: "tone", label: "Tone", type: "choice", options: [["default", "Neutral"], ["info", "Information"], ["success", "Success"], ["warning", "Warning"], ["danger", "Danger"], ["violet", "Violet"]] },
                { key: "appearance", label: "Appearance", type: "choice", options: [["soft", "Soft"], ["outline", "Outline"], ["filled", "Filled"]] }
            ],
            attributes: [
                ["tone", "info | success | warning | danger | violet", "Canonical semantic or rarity color."],
                ["appearance", "soft | outline | filled", "Emphasis without changing meaning."]
            ],
            events: [],
            a11y: ["A badge is static text, not a button. Use a real interactive element for filters or actions.", "The label remains readable without glow and repeats the state conveyed by color.", "Keep badge copy short so it survives dense WebUI layouts."],
            render: renderBadge,
            markup: badgeMarkup
        },
        {
            id: "sg-panel",
            name: "Panel",
            icon: "package",
            category: "Surfaces",
            summary: "A finished large-area surface for one coherent task, module, or status family.",
            description: "Surface primitive",
            keywords: "panel surface container layout padding shell group",
            stageNote: "Panels provide material and spacing; consuming markup owns document structure",
            defaults: {},
            controls: [],
            attributes: [
                ["global HTML", "id | class | aria-*", "No custom attributes; standard global attributes remain available."],
                ["--sg-panel-padding", "CSS custom property", "Overrides the canonical panel padding through the cascade."]
            ],
            events: [],
            a11y: ["A panel is a visual surface and does not create a landmark or accessible name by itself.", "Use headings and an appropriate section, region, or dialog role in the consuming composition when semantics are required.", "Keep one coherent task or status family inside each panel."],
            render: renderPanel,
            markup: panelMarkup
        },
        {
            id: "sg-card",
            name: "Card",
            icon: "briefcase",
            category: "Surfaces",
            summary: "A compact tonal container with optional selected and hover styling hooks for script-owned compositions.",
            description: "Content surface",
            keywords: "card surface selected interactive hover container content",
            stageNote: "The interactive attribute is visual only; it adds no event or keyboard contract",
            defaults: {},
            controls: [],
            attributes: [
                ["selected", "boolean styling hook", "Adds the canonical selected treatment; scripts own the state."],
                ["interactive", "boolean styling hook", "Adds hover and cursor treatment only; it does not add semantics or events."],
                ["global HTML", "id | class | aria-*", "Standard global attributes remain available."]
            ],
            events: [],
            a11y: ["A card is a visual container and has no role, tab stop, or activation event by default.", "Do not rely on interactive alone. Use a native link or button inside the card, or implement a complete consumer-owned keyboard and semantic contract.", "Selected styling must be paired with an accessible state in the consuming interaction."],
            render: renderCard,
            markup: cardMarkup
        },
        {
            id: "sg-icon",
            name: "Icon",
            icon: "circle",
            category: "Foundations",
            summary: "A self-hosted SVG sprite reference that inherits current color and stays decorative unless labeled.",
            description: "Icon primitive",
            keywords: "icon svg sprite lucide label accessible decorative src currentcolor",
            stageNote: "Unlabeled icons are hidden from assistive technology by default",
            defaults: {},
            controls: [],
            attributes: [
                ["name", "sprite symbol name", "Selects a bundled sg-icon-* symbol; circle is the fallback."],
                ["label", "string", "Makes the SVG an accessible image with this label."],
                ["src", "sprite URL", "Optional caller-supplied compatible sprite location."]
            ],
            events: [],
            a11y: ["Without label, the generated SVG receives aria-hidden=true.", "With label, the generated SVG receives role=img and the supplied accessible name.", "Interactive controls still need their own accessible name; an icon label does not replace the control label."],
            render: renderIcon,
            markup: iconMarkup
        },
        {
            id: "sg-divider",
            name: "Divider",
            icon: "circle",
            category: "Foundations",
            summary: "A one-pixel structural separator using the canonical edge color and vertical rhythm.",
            description: "Separation primitive",
            keywords: "divider separator line border rhythm section decorative",
            stageNote: "Add role=separator only when the division is meaningful to assistive technology",
            defaults: {},
            controls: [],
            attributes: [
                ["role", "separator", "Optional global ARIA role for a meaningful structural division."],
                ["global HTML", "id | class | aria-*", "No custom attributes; standard global attributes remain available."]
            ],
            events: [],
            a11y: ["The default element is decorative and does not announce itself.", "Add role=separator when the boundary represents a meaningful change of section.", "Do not use a divider instead of spacing when no structural relationship needs to be communicated."],
            render: renderDivider,
            markup: dividerMarkup
        },
        {
            id: "sg-keybind",
            name: "Keybind",
            icon: "settings",
            category: "Interaction",
            summary: "Single-key and chord prompts with separately rendered keycaps and caller-owned action copy.",
            description: "Input prompt",
            keywords: "keyboard key keybind chord prompt shift interact input",
            stageNote: "Bindings are presentation only; scripts own actual input mapping",
            defaults: { keys: "E", action: "Interact" },
            controls: [
                { key: "keys", label: "Binding", type: "choice", options: [["E", "E"], ["G", "G"], ["X", "X"], ["Shift+E", "Shift + E"]] },
                { key: "action", label: "Action copy", type: "choice", options: [["Interact", "Interact"], ["Pick up item", "Pick up item"], ["Open inventory", "Open inventory"], ["Give all", "Give all"]] }
            ],
            attributes: [
                ["keys", "string joined with +", "Preferred chord syntax, for example Shift+E."],
                ["key", "string", "Backward-compatible single-key attribute."]
            ],
            events: [],
            a11y: ["Each key in a chord is rendered as a separate kbd element.", "Action copy remains visible beside the keycaps; do not rely on the key alone.", "The component documents a binding but does not capture keyboard input."],
            render: renderKeybind,
            markup: keybindMarkup
        }
    ];

    var guides = [
        {
            id: "quickstart",
            route: "guides/quickstart",
            name: "Integration quickstart",
            icon: "package",
            category: "Guide",
            description: "No-build integration",
            summary: "Load two compiled files, compose native markup, then translate emitted DOM events inside your script.",
            keywords: "install integrate vendor css javascript hEvent HELIX copy load compose wire",
            stageNote: "Node is required by library maintainers, not consuming packages",
            render: renderQuickstart,
            markup: quickstartMarkup,
            attributes: [],
            events: [],
            a11y: ["Load the shared stylesheet before rendering components to avoid an unstyled first frame.", "Keep visible labels in consumer markup and preserve the component focus states.", "The hEvent call shown is illustrative and consumer-owned; public components contain no HELIX event names."]
        },
        {
            id: "composition",
            route: "guides/composition",
            name: "Reference composition",
            icon: "users",
            category: "Guide",
            description: "System composition",
            summary: "A compact reference showing how HUD, inventory, prompt, action, and feedback primitives share one grammar.",
            keywords: "reference composition hud inventory status action quickbar illustrative",
            stageNote: "Illustrative values prove composition only; scripts supply all real data",
            render: renderComposition,
            markup: compositionMarkup,
            attributes: [],
            events: [],
            a11y: ["Preserve the heading and landmark hierarchy in the consuming WebUI shell.", "Group related status readings and keep the leading action visually singular.", "Illustrative catalogue values must be replaced with script-owned state before shipping."]
        }
    ];

    var registry = components.concat(guides);
    var current = components[0];
    var model = copyObject(current.defaults);
    var eventLog = [];
    var eventSequence = 0;
    var eventPaused = false;
    var copyTimer = 0;

    var nodes = {};

    document.addEventListener("DOMContentLoaded", initialize);

    function initialize() {
        nodes.body = document.body;
        nodes.componentNav = document.getElementById("component-nav");
        nodes.guideNav = document.getElementById("guide-nav");
        nodes.search = document.getElementById("component-search");
        nodes.searchEmpty = document.getElementById("search-empty");
        nodes.title = document.getElementById("component-title");
        nodes.kicker = document.getElementById("component-kicker");
        nodes.summary = document.getElementById("component-summary");
        nodes.tag = document.getElementById("component-tag");
        nodes.status = document.getElementById("component-status");
        nodes.inspectorTitle = document.getElementById("inspector-title");
        nodes.stage = document.getElementById("component-stage");
        nodes.stageNote = document.getElementById("stage-note");
        nodes.previewRoot = document.getElementById("preview-root");
        nodes.previewDensity = document.getElementById("preview-density");
        nodes.previewEffects = document.getElementById("preview-effects");
        nodes.controls = document.getElementById("panel-controls");
        nodes.api = document.getElementById("panel-api");
        nodes.code = document.getElementById("panel-code");
        nodes.a11y = document.getElementById("panel-a11y");
        nodes.eventDock = document.getElementById("event-dock");
        nodes.eventChannel = document.getElementById("event-channel");
        nodes.eventToggle = document.getElementById("event-toggle");
        nodes.eventList = document.getElementById("event-list");
        nodes.eventSummary = document.getElementById("event-summary");
        nodes.eventPause = document.getElementById("event-pause");
        nodes.copyStatus = document.getElementById("copy-status");
        nodes.clipboardFallback = document.getElementById("clipboard-fallback");
        nodes.drawerToggle = document.getElementById("drawer-toggle");
        nodes.drawerClose = document.getElementById("drawer-close");
        nodes.drawerScrim = document.getElementById("drawer-scrim");

        renderNavigation();
        bindInterface();
        selectFromHash();
    }

    function bindInterface() {
        window.addEventListener("hashchange", selectFromHash);
        nodes.search.addEventListener("input", filterRegistry);
        nodes.search.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && nodes.search.value) {
                nodes.search.value = "";
                filterRegistry();
            }
        });

        document.addEventListener("keydown", function (event) {
            var targetName = event.target && event.target.tagName ? event.target.tagName.toLowerCase() : "";
            var isEditing = targetName === "input" || targetName === "textarea" || targetName === "select";
            if (event.key === "/" && !isEditing) {
                event.preventDefault();
                openDrawer();
                nodes.search.focus();
            }
            if (event.key === "Escape" && nodes.body.dataset.drawerOpen === "true") {
                closeDrawer(true);
            }
        });

        nodes.drawerToggle.addEventListener("click", openDrawer);
        nodes.drawerClose.addEventListener("click", function () { closeDrawer(true); });
        nodes.drawerScrim.addEventListener("click", function () { closeDrawer(true); });

        document.getElementById("density-toggle").addEventListener("click", toggleDensity);
        document.getElementById("effects-toggle").addEventListener("click", toggleEffects);

        document.querySelector(".inspector-tabs").addEventListener("click", function (event) {
            var tab = event.target.closest("[role='tab']");
            if (tab) activateTab(tab);
        });
        document.querySelector(".inspector-tabs").addEventListener("keydown", moveTabFocus);

        nodes.controls.addEventListener("click", handleControlClick);
        nodes.stage.addEventListener("click", handleStageAction);
        nodes.code.addEventListener("click", function (event) {
            var button = event.target.closest("[data-copy-code]");
            if (button) copyText(current.markup(model), "Markup copied");
        });

        nodes.eventToggle.addEventListener("click", toggleEventDock);
        nodes.eventPause.addEventListener("click", toggleEventPause);
        document.getElementById("event-clear").addEventListener("click", clearEventLog);
        document.getElementById("event-copy").addEventListener("click", copyEventLog);

        ["sg-activate", "sg-input", "sg-change", "sg-item-activate", "sg-dismiss", "sg-close"].forEach(function (eventName) {
            document.addEventListener(eventName, recordComponentEvent);
        });

        document.addEventListener("sg-item-activate", function (event) {
            if (event.target && event.target.tagName && event.target.tagName.toLowerCase() === "sg-item-slot") {
                event.target.toggleAttribute("selected", Boolean(event.detail.selected));
                model.selected = Boolean(event.detail.selected);
                renderInspector();
            }
        });
    }

    function renderNavigation() {
        nodes.componentNav.innerHTML = components.map(function (entry) {
            return navigationLink(entry, "components/" + entry.id);
        }).join("");
        nodes.guideNav.innerHTML = guides.map(function (entry) {
            return navigationLink(entry, entry.route);
        }).join("");

        var links = document.querySelectorAll(".registry-link");
        Array.prototype.forEach.call(links, function (link) {
            link.addEventListener("click", function () {
                var usedDrawer = nodes.body.dataset.drawerOpen === "true";
                closeDrawer(false);
                if (usedDrawer) {
                    window.setTimeout(function () { document.getElementById("main-workbench").focus(); }, 0);
                }
            });
        });
    }

    function navigationLink(entry, route) {
        var tag = entry.id.indexOf("sg-") === 0 ? entry.id.replace("sg-", "") : "guide";
        return "<a class=\"registry-link\" href=\"#" + route + "\" data-registry-id=\"" + entry.id + "\" data-search=\"" + escapeAttribute(searchText(entry)) + "\">" +
            "<span class=\"registry-icon\" aria-hidden=\"true\"><sg-icon name=\"" + entry.icon + "\"></sg-icon></span>" +
            "<span class=\"registry-copy\"><strong>" + escapeHtml(entry.name) + "</strong><small>" + escapeHtml(entry.category) + "</small></span>" +
            (entry.id.indexOf("sg-") === 0 ? "<span class=\"registry-tag\">" + tag + "</span>" : "") +
            "</a>";
    }

    function searchText(entry) {
        var api = (entry.attributes || []).concat(entry.events || []).map(function (row) { return row.join(" "); }).join(" ");
        return (entry.name + " " + entry.category + " " + entry.summary + " " + entry.keywords + " " + api).toLowerCase();
    }

    function filterRegistry() {
        var query = nodes.search.value.trim().toLowerCase();
        var visible = 0;
        var links = document.querySelectorAll(".registry-link");
        Array.prototype.forEach.call(links, function (link) {
            var match = !query || link.getAttribute("data-search").indexOf(query) !== -1;
            link.hidden = !match;
            if (match) visible += 1;
        });
        nodes.searchEmpty.hidden = visible !== 0;
    }

    function selectFromHash() {
        var route = window.location.hash.replace(/^#\/?/, "");
        var entry = null;
        if (route.indexOf("components/") === 0) {
            var componentId = route.slice("components/".length);
            entry = findById(components, componentId);
        } else if (route.indexOf("guides/") === 0) {
            entry = findByRoute(guides, route);
        }
        if (!entry) {
            window.location.hash = "components/sg-button";
            return;
        }
        selectEntry(entry);
    }

    function selectEntry(entry) {
        current = entry;
        model = copyObject(entry.defaults || {});

        var links = document.querySelectorAll(".registry-link");
        Array.prototype.forEach.call(links, function (link) {
            if (link.getAttribute("data-registry-id") === entry.id) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });

        nodes.kicker.textContent = entry.description;
        nodes.title.textContent = entry.name;
        nodes.summary.textContent = entry.summary;
        nodes.tag.textContent = entry.id.indexOf("sg-") === 0 ? entry.id : "Genesis guide";
        nodes.inspectorTitle.textContent = entry.id.indexOf("sg-") === 0 ? entry.id : entry.name;
        nodes.stageNote.textContent = entry.stageNote;
        nodes.status.textContent = entry.id.indexOf("sg-") === 0 ? "Alpha" : "Guide";
        nodes.status.setAttribute("tone", entry.id.indexOf("sg-") === 0 ? "info" : "violet");
        document.title = entry.name + " — Genesis Shadow Glass";

        renderStage(true);
        renderInspector();
        closeDrawer(false);
    }

    function renderStage(animate) {
        nodes.stage.innerHTML = current.render(model);
        if (animate) {
            nodes.stage.dataset.entering = "true";
            window.setTimeout(function () { delete nodes.stage.dataset.entering; }, 380);
        }
    }

    function renderInspector() {
        renderControls();
        renderApi();
        renderCode();
        renderA11y();
    }

    function renderControls() {
        if (!current.controls || current.controls.length === 0) {
            nodes.controls.innerHTML = "<section class=\"contract-section\"><h3>Guide focus</h3><p>This route is a reference workflow. Select a component to expose live state controls.</p></section>" +
                "<section class=\"contract-section\"><h3>Evidence boundary</h3><p class=\"truth-note\">The package-local harness rendered and exchanged events in the current HELIX bleeding-edge client. Re-test each release because the embedded runtime can change independently.</p></section>";
            return;
        }

        nodes.controls.innerHTML = current.controls.map(function (control) {
            if (control.type === "boolean") {
                var pressed = Boolean(model[control.key]);
                return "<fieldset class=\"control-group\"><legend>State</legend><button class=\"boolean-control\" type=\"button\" data-control=\"" + control.key + "\" data-boolean=\"true\" aria-pressed=\"" + pressed + "\">" + escapeHtml(control.label) + "</button></fieldset>";
            }
            return "<fieldset class=\"control-group\"><legend>" + escapeHtml(control.label) + "</legend><div class=\"choice-grid\">" + control.options.map(function (option) {
                var active = String(model[control.key]) === option[0];
                return "<button class=\"choice-button\" type=\"button\" data-control=\"" + control.key + "\" data-value=\"" + escapeAttribute(option[0]) + "\" aria-pressed=\"" + active + "\">" + escapeHtml(option[1]) + "</button>";
            }).join("") + "</div></fieldset>";
        }).join("") + "<p class=\"control-note\">Changes are scoped to this preview and regenerate the markup automatically.</p>";
    }

    function renderApi() {
        var attributeRows = current.attributes && current.attributes.length ? tableRows(current.attributes) : "<tr><td colspan=\"2\">This guide has no public element attributes.</td></tr>";
        var eventRows = current.events && current.events.length ? tableRows(current.events) : "<tr><td colspan=\"2\">No component events. This primitive is presentational.</td></tr>";
        nodes.api.innerHTML = "<section class=\"contract-section\"><h3>Attributes and hooks</h3><table class=\"contract-table\"><tbody>" + attributeRows + "</tbody></table></section>" +
            "<section class=\"contract-section\"><h3>Events</h3><table class=\"contract-table\"><tbody>" + eventRows + "</tbody></table></section>" +
            "<section class=\"contract-section\"><h3>Ownership boundary</h3><p>Presentation, focus, and component state are library-owned. Data, permissions, gameplay rules, and HELIX event names remain script-owned.</p></section>";
    }

    function tableRows(rows) {
        return rows.map(function (row) {
            return "<tr><th scope=\"row\"><code>" + escapeHtml(row[0]) + "</code><br><span>" + escapeHtml(row[1]) + "</span></th><td>" + escapeHtml(row[2]) + "</td></tr>";
        }).join("");
    }

    function renderCode() {
        var markup = current.markup(model);
        nodes.code.innerHTML = "<section class=\"contract-section\"><h3>Generated markup</h3><div class=\"code-shell\"><div class=\"code-toolbar\"><span>HTML + DOM events</span><button class=\"copy-button\" type=\"button\" data-copy-code>Copy</button></div><pre><code></code></pre></div></section>" +
            "<section class=\"contract-section\"><h3>Package note</h3><p>Use package-relative asset paths. No CDN or runtime framework is required.</p></section>";
        nodes.code.querySelector("code").textContent = markup;
    }

    function renderA11y() {
        nodes.a11y.innerHTML = "<section class=\"contract-section\"><h3>Accessibility contract</h3><ul class=\"a11y-list\">" + current.a11y.map(function (item) {
            return "<li>" + escapeHtml(item) + "</li>";
        }).join("") + "</ul></section>" +
            "<section class=\"contract-section\"><h3>Runtime check</h3><p>Verify focus order, zoom, gamepad mapping, and contrast inside the target HELIX WebUI before release.</p></section>";
    }

    function handleControlClick(event) {
        var button = event.target.closest("[data-control]");
        if (!button) return;
        var key = button.getAttribute("data-control");
        if (button.hasAttribute("data-boolean")) {
            model[key] = !model[key];
        } else {
            model[key] = button.getAttribute("data-value");
        }
        normalizeModel(key);
        renderStage(false);
        renderInspector();
    }

    function handleStageAction(event) {
        var opener = event.target.closest("[data-demo-open]");
        if (opener) {
            var targetName = opener.getAttribute("data-demo-open");
            var overlay = nodes.stage.querySelector("sg-" + targetName);
            if (overlay) overlay.open = true;
            return;
        }
        var closer = event.target.closest("[data-demo-close]");
        if (closer) {
            var closeName = closer.getAttribute("data-demo-close");
            var closeTarget = nodes.stage.querySelector("sg-" + closeName);
            if (closeTarget) closeTarget.open = false;
            return;
        }
        var showToast = event.target.closest("[data-demo-show-toast]");
        if (showToast) {
            var toast = nodes.stage.querySelector("sg-toast");
            if (toast && typeof toast.show === "function") toast.show();
        }
    }

    function normalizeModel(changedKey) {
        if (current.id !== "sg-item-slot") return;
        if (changedKey === "empty" && model.empty) {
            model.selected = false;
            model.locked = false;
            model.rarity = "default";
        }
        if (changedKey === "locked" && model.locked) {
            model.selected = false;
            model.empty = false;
        }
        if (changedKey === "selected" && model.selected) {
            model.locked = false;
            model.empty = false;
        }
        if (changedKey === "rarity" && model.rarity !== "default") {
            model.empty = false;
        }
    }

    function activateTab(tab) {
        var tabs = document.querySelectorAll(".inspector-tabs [role='tab']");
        Array.prototype.forEach.call(tabs, function (candidate) {
            var active = candidate === tab;
            candidate.setAttribute("aria-selected", String(active));
            candidate.tabIndex = active ? 0 : -1;
            document.getElementById(candidate.getAttribute("aria-controls")).hidden = !active;
        });
    }

    function moveTabFocus(event) {
        if (["ArrowLeft", "ArrowRight", "Home", "End"].indexOf(event.key) === -1) return;
        var tabs = Array.prototype.slice.call(document.querySelectorAll(".inspector-tabs [role='tab']"));
        var index = tabs.indexOf(document.activeElement);
        if (index === -1) return;
        event.preventDefault();
        if (event.key === "Home") index = 0;
        if (event.key === "End") index = tabs.length - 1;
        if (event.key === "ArrowLeft") index = (index - 1 + tabs.length) % tabs.length;
        if (event.key === "ArrowRight") index = (index + 1) % tabs.length;
        tabs[index].focus();
        activateTab(tabs[index]);
    }

    function toggleDensity() {
        var button = document.getElementById("density-toggle");
        var compact = nodes.previewRoot.dataset.sgDensity !== "compact";
        nodes.previewRoot.dataset.sgDensity = compact ? "compact" : "default";
        button.setAttribute("aria-pressed", String(compact));
        button.querySelector("strong").textContent = compact ? "Compact" : "Default";
        nodes.previewDensity.textContent = compact ? "Compact density" : "Default density";
    }

    function toggleEffects() {
        var button = document.getElementById("effects-toggle");
        var reduced = nodes.previewRoot.dataset.sgEffects !== "reduced";
        nodes.previewRoot.dataset.sgEffects = reduced ? "reduced" : "default";
        button.setAttribute("aria-pressed", String(reduced));
        button.querySelector("strong").textContent = reduced ? "Reduced" : "Full";
        nodes.previewEffects.textContent = reduced ? "Reduced effects" : "Full effects";
    }

    function toggleEventDock() {
        var expanded = nodes.eventDock.dataset.expanded !== "true";
        nodes.eventDock.dataset.expanded = String(expanded);
        nodes.body.dataset.eventExpanded = String(expanded);
        nodes.eventToggle.setAttribute("aria-expanded", String(expanded));
        nodes.eventChannel.hidden = !expanded;
    }

    function toggleEventPause() {
        eventPaused = !eventPaused;
        nodes.eventPause.setAttribute("aria-pressed", String(eventPaused));
        nodes.eventPause.textContent = eventPaused ? "Resume" : "Pause";
        nodes.eventSummary.textContent = eventPaused ? "Capture paused" : (eventLog.length ? eventLog[0].name + " captured" : "Listening for bubbling sg-* events");
    }

    function recordComponentEvent(event) {
        if (eventPaused) return;
        var target = event.target;
        var detail = event.detail || {};
        var record = {
            sequence: ++eventSequence,
            time: new Date().toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }),
            name: event.type,
            source: target && target.tagName ? target.tagName.toLowerCase() : "document",
            detail: safeStringify(detail),
            cancelable: event.cancelable,
            defaultPrevented: event.defaultPrevented
        };
        window.setTimeout(function () {
            record.defaultPrevented = event.defaultPrevented;
            if (eventLog.length === 0 && nodes.eventDock.dataset.expanded !== "true") {
                nodes.eventDock.dataset.expanded = "true";
                nodes.body.dataset.eventExpanded = "true";
                nodes.eventToggle.setAttribute("aria-expanded", "true");
                nodes.eventChannel.hidden = false;
            }
            if (eventLog.length === 0) {
                nodes.copyStatus.textContent = record.name + " captured";
            }
            eventLog.unshift(record);
            eventLog = eventLog.slice(0, 40);
            renderEventLog();
        }, 0);
    }

    function renderEventLog() {
        nodes.eventSummary.textContent = eventLog.length ? eventLog[0].name + " captured from " + eventLog[0].source : "Listening for bubbling sg-* events";
        if (!eventLog.length) {
            nodes.eventList.innerHTML = "<li class=\"event-empty\">No events yet. Activate the live specimen to inspect its payload.</li>";
            return;
        }
        nodes.eventList.innerHTML = eventLog.map(function (record) {
            var metadata = record.detail + " · cancelable:" + record.cancelable + " · defaultPrevented:" + record.defaultPrevented;
            return "<li class=\"event-entry\"><span>#" + record.sequence + "</span><time>" + record.time + "</time><strong>" + escapeHtml(record.name) + " · " + escapeHtml(record.source) + "</strong><code>" + escapeHtml(metadata) + "</code></li>";
        }).join("");
    }

    function clearEventLog() {
        eventLog = [];
        renderEventLog();
    }

    function copyEventLog() {
        if (!eventLog.length) {
            showCopyStatus("Event log is empty");
            return;
        }
        var text = eventLog.map(function (record) {
            return "#" + record.sequence + " " + record.time + " " + record.name + " source=" + record.source + " detail=" + record.detail + " cancelable=" + record.cancelable + " defaultPrevented=" + record.defaultPrevented;
        }).join("\n");
        copyText(text, "Event log copied");
    }

    function copyText(text, successMessage) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function () {
                showCopyStatus(successMessage);
            }).catch(function () {
                fallbackCopy(text, successMessage);
            });
        } else {
            fallbackCopy(text, successMessage);
        }
    }

    function fallbackCopy(text, successMessage) {
        var previousFocus = document.activeElement;
        nodes.clipboardFallback.value = text;
        nodes.clipboardFallback.removeAttribute("aria-hidden");
        nodes.clipboardFallback.focus();
        nodes.clipboardFallback.select();
        var copied = false;
        try { copied = document.execCommand("copy"); } catch (error) { copied = false; }
        nodes.clipboardFallback.setAttribute("aria-hidden", "true");
        if (previousFocus && typeof previousFocus.focus === "function") previousFocus.focus();
        showCopyStatus(copied ? successMessage : "Copy unavailable — select the code manually");
    }

    function showCopyStatus(message) {
        window.clearTimeout(copyTimer);
        nodes.copyStatus.textContent = message;
        nodes.copyStatus.dataset.visible = "true";
        copyTimer = window.setTimeout(function () { delete nodes.copyStatus.dataset.visible; }, 2200);
    }

    function openDrawer() {
        nodes.body.dataset.drawerOpen = "true";
        nodes.drawerScrim.hidden = false;
        nodes.drawerToggle.setAttribute("aria-expanded", "true");
        window.setTimeout(function () { nodes.search.focus(); }, 0);
    }

    function closeDrawer(restoreFocus) {
        if (nodes.body.dataset.drawerOpen !== "true") return;
        delete nodes.body.dataset.drawerOpen;
        nodes.drawerScrim.hidden = true;
        nodes.drawerToggle.setAttribute("aria-expanded", "false");
        if (restoreFocus) nodes.drawerToggle.focus();
    }

    function renderButton(state) {
        return "<div class=\"stage-stack\"><div class=\"stage-row\">" + buttonMarkup(state, true) + "</div><p class=\"stage-caption\">The preview emits a real DOM event; no HELIX action is hard-coded.</p></div>";
    }

    function buttonMarkup(state, stage) {
        var attributes = [];
        if (state.variant) attributes.push("variant=\"" + state.variant + "\"");
        if (state.size && state.size !== "md") attributes.push("size=\"" + state.size + "\"");
        if (state.loading) attributes.push("loading");
        if (state.disabled) attributes.push("disabled");
        var icon = stage ? "<sg-icon name=\"hand\"></sg-icon>" : "";
        return "<sg-button id=\"confirm-action\"" + attributeString(attributes) + ">" + icon + "Confirm action</sg-button>";
    }

    function renderIconButton(state) {
        return "<div class=\"stage-stack\"><div class=\"stage-row\">" + iconButtonMarkup(state) + "<span class=\"stage-caption\">" + escapeHtml(iconButtonLabel(state.icon)) + "</span></div><p class=\"stage-caption\">Compact utility actions keep a clear accessible name even when no text is visible inside the control.</p></div>";
    }

    function iconButtonMarkup(state) {
        var attributes = ["icon=\"" + state.icon + "\"", "label=\"" + iconButtonLabel(state.icon) + "\"", "variant=\"" + state.variant + "\"", "size=\"" + state.size + "\""];
        if (state.pressed) attributes.push("pressed");
        if (state.loading) attributes.push("loading");
        if (state.disabled) attributes.push("disabled");
        return "<sg-icon-button " + attributes.join(" ") + "></sg-icon-button>";
    }

    function iconButtonLabel(icon) {
        var labels = { settings: "Open settings", search: "Search records", x: "Close panel", plus: "Add entry" };
        return labels[icon] || "Utility action";
    }

    function renderInput(state) {
        return "<div class=\"stage-stack\">" + inputMarkup(state) + "<p class=\"stage-caption\">The field emits browser-native value timing through library-owned DOM events.</p></div>";
    }

    function inputMarkup(state) {
        var presets = {
            text: { label: "Radio callsign", value: "LSPD 1", placeholder: "Enter callsign", hint: "Shown to nearby units." },
            search: { label: "Search inventory", value: "", placeholder: "Search items", hint: "Matches item names and categories." },
            password: { label: "Terminal access code", value: "", placeholder: "Enter access code", hint: "Use the code issued for this terminal." },
            number: { label: "Transfer amount", value: "250", placeholder: "0", hint: "Enter an amount from 1 to 10000." }
        };
        var preset = presets[state.type] || presets.text;
        var attributes = ["label=\"" + preset.label + "\"", "name=\"control-demo\"", "type=\"" + state.type + "\"", "value=\"" + preset.value + "\"", "placeholder=\"" + preset.placeholder + "\"", "hint=\"" + preset.hint + "\""];
        if (state.type === "search") attributes.push("icon=\"search\"");
        if (state.type === "number") attributes.push("min=\"1\"", "max=\"10000\"", "step=\"1\"");
        if (state.required) attributes.push("required");
        if (state.invalid) attributes.push("invalid", "error=\"Review this value before continuing.\"");
        if (state.readonly) attributes.push("readonly");
        if (state.disabled) attributes.push("disabled");
        return "<sg-input " + attributes.join(" ") + "></sg-input>";
    }

    function renderSelect(state) {
        return "<div class=\"stage-stack\">" + selectMarkup(state) + "<p class=\"stage-caption\">The component styles caller-owned native options without taking ownership of radio or duty logic.</p></div>";
    }

    function selectMarkup(state) {
        var attributes = ["label=\"Active radio channel\"", "name=\"radio-channel\"", "value=\"" + state.value + "\"", "hint=\"Choose the channel used for duty communications.\""];
        if (state.required) attributes.push("required");
        if (state.multiple) attributes.push("multiple", "size=\"3\"");
        if (state.invalid) attributes.push("invalid", "error=\"Select an available duty channel.\"");
        if (state.disabled) attributes.push("disabled");
        return "<sg-select " + attributes.join(" ") + ">\n" +
            "  <option value=\"dispatch\">Dispatch</option>\n" +
            "  <option value=\"patrol\">Patrol 1</option>\n" +
            "  <option value=\"tactical\">Tactical</option>\n" +
            "</sg-select>";
    }

    function renderToggle(state) {
        return "<div class=\"stage-stack\">" + toggleMarkup(state) + "<p class=\"stage-caption\">Immediate binary settings emit the requested state; scripts remain authoritative.</p></div>";
    }

    function toggleMarkup(state) {
        var attributes = ["label=\"Proximity voice\"", "name=\"proximity-voice\"", "value=\"enabled\"", "hint=\"Allow nearby players to hear your voice channel.\""];
        if (state.checked) attributes.push("checked");
        if (state.disabled) attributes.push("disabled");
        return "<sg-toggle " + attributes.join(" ") + "></sg-toggle>";
    }

    function renderSlider(state) {
        return "<div class=\"stage-stack\">" + sliderMarkup(state) + "<p class=\"stage-caption\">A stable percentage reading keeps live radio adjustments scannable.</p></div>";
    }

    function sliderMarkup(state) {
        var attributes = ["label=\"Radio volume\"", "name=\"radio-volume\"", "value=\"" + state.value + "\"", "min=\"0\"", "max=\"100\"", "step=\"5\"", "unit=\"%\"", "hint=\"Adjust incoming duty-channel audio.\""];
        if (state.showValue) attributes.push("show-value");
        if (state.disabled) attributes.push("disabled");
        return "<sg-slider " + attributes.join(" ") + "></sg-slider>";
    }

    function renderTabs(state) {
        return "<div class=\"stage-stack\">" + tabsMarkup(state) + "<p class=\"stage-caption\">Tab content remains ordinary caller markup and can contain any Genesis component.</p></div>";
    }

    function tabsMarkup(state) {
        return "<sg-tabs value=\"" + state.value + "\" orientation=\"" + state.orientation + "\">\n" +
            "  <button data-sg-tab value=\"overview\">Overview</button>\n" +
            "  <button data-sg-tab value=\"inventory\">Inventory</button>\n" +
            "  <button data-sg-tab value=\"settings\">Settings</button>\n" +
            "  <section data-sg-panel value=\"overview\">Identity and duty summary.</section>\n" +
            "  <section data-sg-panel value=\"inventory\">Equipment and carried items.</section>\n" +
            "  <section data-sg-panel value=\"settings\">Local interface preferences.</section>\n" +
            "</sg-tabs>";
    }

    function renderSegmented(state) {
        return "<div class=\"stage-stack\">" + segmentedMarkup(state) + "<p class=\"stage-caption\">One selected mode is communicated through position, fill, and programmatic state.</p></div>";
    }

    function segmentedMarkup(state) {
        var attributes = ["label=\"Inventory view\"", "value=\"" + state.value + "\"", "size=\"" + state.size + "\""];
        if (state.fullWidth) attributes.push("full-width");
        if (state.disabled) attributes.push("disabled");
        return "<sg-segmented " + attributes.join(" ") + ">\n" +
            "  <button value=\"list\">List</button>\n" +
            "  <button value=\"grid\">Grid</button>\n" +
            "  <button value=\"tiles\">Tiles</button>\n" +
            "</sg-segmented>";
    }

    function renderModal(state) {
        return "<div class=\"stage-stack\"><sg-button variant=\"primary\" data-demo-open=\"modal\">Open modal</sg-button>" + modalMarkup(state) + "<p class=\"stage-caption\">The shell opens at document level and returns focus to this launcher.</p></div>";
    }

    function modalMarkup(state) {
        var attributes = ["label=\"Confirm vehicle transfer\"", "size=\"" + state.size + "\""];
        if (state.dismissible) attributes.push("dismissible");
        return "<sg-modal " + attributes.join(" ") + ">\n" +
            "  <p>Transfer this vehicle to Jordan Carter? The receiving player must have an available garage slot.</p>\n" +
            "  <div data-sg-actions>\n" +
            "    <sg-button variant=\"ghost\" data-demo-close=\"modal\">Cancel</sg-button>\n" +
            "    <sg-button variant=\"primary\">Confirm transfer</sg-button>\n" +
            "  </div>\n" +
            "</sg-modal>";
    }

    function renderDrawer(state) {
        return "<div class=\"stage-stack\"><sg-button data-demo-open=\"drawer\">Open drawer</sg-button>" + drawerMarkup(state) + "<p class=\"stage-caption\">A drawer supports one secondary workflow without replacing the underlying screen.</p></div>";
    }

    function drawerMarkup(state) {
        var attributes = ["label=\"Player details\"", "side=\"" + state.side + "\"", "size=\"" + state.size + "\""];
        if (state.dismissible) attributes.push("dismissible");
        return "<sg-drawer " + attributes.join(" ") + ">\n" +
            "  <p class=\"sg-overline\">Citizen record</p>\n" +
            "  <h3>Jordan Carter</h3>\n" +
            "  <p>ID 2501 · Los Santos · Civilian</p>\n" +
            "  <div data-sg-actions><sg-button variant=\"ghost\" data-demo-close=\"drawer\">Done</sg-button></div>\n" +
            "</sg-drawer>";
    }

    function renderTooltip(state) {
        return "<div class=\"tooltip-stage\">" + tooltipMarkup(state) + "</div>";
    }

    function tooltipMarkup(state) {
        var attributes = ["content=\"Open audio settings\"", "placement=\"" + state.placement + "\""];
        if (state.disabled) attributes.push("disabled");
        return "<sg-tooltip " + attributes.join(" ") + ">\n" +
            "  <sg-icon-button icon=\"settings\" label=\"Audio settings\"></sg-icon-button>\n" +
            "</sg-tooltip>";
    }

    function renderToast(state) {
        return "<div class=\"stage-stack toast-stage\"><sg-button size=\"sm\" data-demo-show-toast>Show toast</sg-button><div class=\"sg-toast-stack\">" + toastMarkup(state) + "</div></div>";
    }

    function toastMarkup(state) {
        var attributes = ["tone=\"" + state.tone + "\"", "duration=\"" + state.duration + "\""];
        if (state.dismissible) attributes.push("dismissible");
        if (state.urgent) attributes.push("urgent");
        var messages = {
            info: "A new duty assignment is available.",
            success: "Vehicle transfer completed.",
            warning: "Inventory capacity is nearly full.",
            danger: "Unable to reach the server. Try again."
        };
        return "<sg-toast " + attributes.join(" ") + ">" + messages[state.tone] + "</sg-toast>";
    }

    function renderStat(state) {
        return "<div class=\"stage-grid\">" + statMarkup(state) + "<sg-stat icon=\"zap\" label=\"Stamina\" value=\"82%\" progress=\"82\" tone=\"success\"></sg-stat></div>";
    }

    function statMarkup(state) {
        var attributes = ["icon=\"shield\"", "label=\"Armor\"", "value=\"75%\""];
        if (state.detail) attributes.push("detail=\"Protective capacity\"");
        if (state.progress !== "none") attributes.push("progress=\"" + state.progress + "\"");
        if (state.tone !== "default") attributes.push("tone=\"" + state.tone + "\"");
        return "<sg-stat " + attributes.join(" ") + "></sg-stat>";
    }

    function renderItem(state) {
        return "<div class=\"stage-stack\"><div class=\"stage-items\">" + itemMarkup(state, true) + "<sg-item-slot label=\"Empty slot\" empty></sg-item-slot></div><p class=\"stage-caption\">Illustrative media only. The consuming inventory supplies licensed item artwork.</p></div>";
    }

    function itemMarkup(state, stage) {
        if (state.empty) {
            return "<sg-item-slot label=\"Empty slot\" empty></sg-item-slot>";
        }
        var attributes = ["label=\"Medkit\"", "quantity=\"2×\"", "meta=\"1.0 kg\""];
        if (state.rarity !== "default") attributes.push("rarity=\"" + state.rarity + "\"");
        if (state.selected) attributes.push("selected");
        if (state.locked) attributes.push("locked");
        var media = stage ? "\n  <sg-icon class=\"demo-item demo-item--medkit\" name=\"plus\" label=\"Illustrative medkit\"></sg-icon>\n" : "\n  <!-- Caller-owned item media -->\n";
        return "<sg-item-slot " + attributes.join(" ") + ">" + media + "</sg-item-slot>";
    }

    function renderAlert(state) {
        return "<div class=\"stage-stack\">" + alertMarkup(state) + "<p class=\"stage-caption\">Urgent announcement is opt-in; visual danger does not automatically interrupt assistive technology.</p></div>";
    }

    function alertMarkup(state) {
        var attributes = ["tone=\"" + state.tone + "\""];
        if (state.dismissible) attributes.push("dismissible");
        if (state.urgent) attributes.push("urgent");
        var messages = {
            info: "Your paycheck is available.",
            success: "Your changes have been saved.",
            warning: "Inventory capacity is almost full.",
            danger: "Unable to save changes. Review the connection and try again."
        };
        return "<sg-alert " + attributes.join(" ") + ">" + messages[state.tone] + "</sg-alert>";
    }

    function renderBadge(state) {
        return "<div class=\"stage-stack\"><div class=\"stage-row\">" + badgeMarkup(state) + "<sg-badge tone=\"success\" appearance=\"outline\">Safe zone</sg-badge><sg-badge tone=\"violet\" appearance=\"filled\">Epic</sg-badge></div><p class=\"stage-caption\">Static labels stay concise. Interactive filters should use a real button pattern.</p></div>";
    }

    function badgeMarkup(state) {
        var attributes = [];
        if (state.tone !== "default") attributes.push("tone=\"" + state.tone + "\"");
        if (state.appearance !== "soft") attributes.push("appearance=\"" + state.appearance + "\"");
        return "<sg-badge" + attributeString(attributes) + ">On duty</sg-badge>";
    }

    function renderPanel() {
        return "<div class=\"surface-stage\"><sg-panel class=\"surface-demo surface-demo--panel\"><span class=\"section-label\">Loadout module</span><h3>Operational equipment</h3><p>Group one coherent task on a finished Shadow Glass surface.</p><div class=\"stage-row stage-row--start\"><sg-badge tone=\"success\">Available</sg-badge><sg-button size=\"sm\">Inspect</sg-button></div></sg-panel></div>";
    }

    function panelMarkup() {
        return "<sg-panel>\n" +
            "  <h2>Operational equipment</h2>\n" +
            "  <p>Caller-owned panel content.</p>\n" +
            "</sg-panel>";
    }

    function renderCard() {
        return "<div class=\"surface-stage surface-stage--cards\"><sg-card class=\"surface-demo\"><span class=\"section-label\">Default</span><h3>Vehicle record</h3><p>Quiet tonal containment for compact content.</p></sg-card><sg-card class=\"surface-demo\" selected><span class=\"section-label\">Selected</span><h3>Active vehicle</h3><p>Selection remains caller-owned state.</p></sg-card></div>";
    }

    function cardMarkup() {
        return "<sg-card selected>\n" +
            "  <h3>Active vehicle</h3>\n" +
            "  <p>Caller-owned card content.</p>\n" +
            "</sg-card>";
    }

    function renderIcon() {
        return "<div class=\"stage-stack\"><div class=\"icon-stage\"><span><sg-icon name=\"heart\" label=\"Health\"></sg-icon><small>Health</small></span><span><sg-icon name=\"shield\" label=\"Armor\"></sg-icon><small>Armor</small></span><span><sg-icon name=\"radio\" label=\"Radio\"></sg-icon><small>Radio</small></span><span><sg-icon name=\"backpack\" label=\"Inventory\"></sg-icon><small>Inventory</small></span></div><p class=\"stage-caption\">The catalogue labels these standalone examples. Icons inside labeled controls normally remain decorative.</p></div>";
    }

    function iconMarkup() {
        return "<sg-icon name=\"shield\" label=\"Armor\"></sg-icon>";
    }

    function renderDivider() {
        return "<div class=\"divider-stage\"><div><span class=\"section-label\">Primary status</span><strong>Player ready</strong></div><sg-divider role=\"separator\"></sg-divider><div><span class=\"section-label\">Secondary status</span><strong>Awaiting dispatch</strong></div></div>";
    }

    function dividerMarkup() {
        return "<sg-divider role=\"separator\"></sg-divider>";
    }

    function renderKeybind(state) {
        return "<div class=\"stage-stack\"><div class=\"stage-row\">" + keybindMarkup(state) + "</div><p class=\"stage-caption\">Chords become distinct keycaps while the action remains caller-owned text.</p></div>";
    }

    function keybindMarkup(state) {
        return "<sg-keybind keys=\"" + escapeAttribute(state.keys) + "\">" + escapeHtml(state.action) + "</sg-keybind>";
    }

    function renderQuickstart() {
        return "<div class=\"guide-preview\"><div class=\"guide-steps\"><div class=\"guide-step\"><span>01 / LOAD</span><strong>Two local assets</strong><small>Compiled CSS and JavaScript live with the consuming package.</small></div><div class=\"guide-step\"><span>02 / COMPOSE</span><strong>Native markup</strong><small>Use sg-* elements directly in the package HTML.</small></div><div class=\"guide-step\"><span>03 / WIRE</span><strong>DOM events</strong><small>Translate library events into script-owned HELIX calls.</small></div></div><p class=\"stage-caption\">No CDN. No runtime framework. No gameplay event names in the library.</p></div>";
    }

    function quickstartMarkup() {
        return "<link rel=\"stylesheet\" href=\"./vendor/genesis-ui/genesis-ui.css\">\n" +
            "<script type=\"module\" src=\"./vendor/genesis-ui/genesis-ui.js\"><\/script>\n\n" +
            "<sg-button id=\"use-item\" variant=\"primary\">Use item</sg-button>\n\n" +
            "<script>\n" +
            "  document.querySelector('#use-item')\n" +
            "    .addEventListener('sg-activate', function () {\n" +
            "      // hEvent and the event name are consumer-owned examples.\n" +
            "      hEvent('inventory:useItem', { itemId: 'medkit' });\n" +
            "    });\n" +
            "<\/script>";
    }

    function renderComposition() {
        return "<div class=\"composition\"><div class=\"composition-stats\"><sg-stat icon=\"heart\" label=\"Health\" value=\"100%\" progress=\"100\" tone=\"danger\"></sg-stat><sg-stat icon=\"shield\" label=\"Armor\" value=\"75%\" progress=\"75\" tone=\"blue\"></sg-stat></div><div class=\"composition-lower\"><div><sg-alert tone=\"info\">Illustrative preview data — replace with script state.</sg-alert><sg-keybind keys=\"Shift+E\">Quick interaction</sg-keybind></div><div><sg-item-slot label=\"Medkit\" quantity=\"2×\" meta=\"1.0 kg\" rarity=\"epic\" selected><sg-icon class=\"demo-item demo-item--medkit\" name=\"plus\" label=\"Illustrative medkit\"></sg-icon></sg-item-slot><sg-button variant=\"primary\">Use item</sg-button></div></div></div>";
    }

    function compositionMarkup() {
        return "<section aria-label=\"Player status\">\n" +
            "  <sg-stat icon=\"heart\" label=\"Health\" value=\"100%\" progress=\"100\" tone=\"danger\"></sg-stat>\n" +
            "  <sg-stat icon=\"shield\" label=\"Armor\" value=\"75%\" progress=\"75\" tone=\"blue\"></sg-stat>\n" +
            "</section>\n\n" +
            "<sg-keybind keys=\"Shift+E\">Quick interaction</sg-keybind>\n" +
            "<sg-button variant=\"primary\">Use item</sg-button>";
    }

    function attributeString(attributes) {
        return attributes.length ? " " + attributes.join(" ") : "";
    }

    function safeStringify(value) {
        try { return JSON.stringify(value); } catch (error) { return "[unserializable detail]"; }
    }

    function findById(list, id) {
        for (var index = 0; index < list.length; index += 1) {
            if (list[index].id === id) return list[index];
        }
        return null;
    }

    function findByRoute(list, route) {
        for (var index = 0; index < list.length; index += 1) {
            if (list[index].route === route) return list[index];
        }
        return null;
    }

    function copyObject(value) {
        var result = {};
        Object.keys(value || {}).forEach(function (key) { result[key] = value[key]; });
        return result;
    }

    function escapeHtml(value) {
        return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#039;");
    }

    function escapeAttribute(value) {
        return escapeHtml(value).replace(/`/g, "&#096;");
    }
})();
