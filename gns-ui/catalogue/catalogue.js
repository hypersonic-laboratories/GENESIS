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
            id: "sg-checkbox",
            name: "Checkbox",
            icon: "check",
            category: "Forms",
            summary: "A native checkbox with checked, mixed, disabled, and validation states that remain readable without color.",
            description: "Independent choice primitive",
            keywords: "checkbox checked indeterminate required disabled error hint native sg-change",
            stageNote: "Mixed state clears on interaction and emits the resulting checked value",
            defaults: { checked: true, indeterminate: false, invalid: false, disabled: false },
            controls: [
                { key: "checked", label: "Checked", type: "boolean" },
                { key: "indeterminate", label: "Mixed", type: "boolean" },
                { key: "invalid", label: "Invalid", type: "boolean" },
                { key: "disabled", label: "Disabled", type: "boolean" }
            ],
            attributes: [
                ["label", "string", "Required visible choice label."],
                ["checked / indeterminate", "boolean", "Current binary or mixed visual state."],
                ["name / value", "string", "Form-compatible field identity included in event detail."],
                ["hint / error", "string", "Supporting guidance or recoverable validation message."],
                ["required / disabled / invalid", "boolean", "Native constraint and explicit availability states."]
            ],
            events: [["sg-change", "{ checked, indeterminate, value, name }", "Bubbles after native checkbox interaction."]],
            a11y: ["Uses a native checkbox with a programmatically associated visible label.", "Mixed state is exposed through the native indeterminate property and clears after a user choice.", "Validation uses linked text and aria-invalid instead of color alone."],
            render: renderCheckbox,
            markup: checkboxMarkup
        },
        {
            id: "sg-radio-group",
            name: "Radio group",
            icon: "circle",
            category: "Forms",
            summary: "A labeled native radio group for one choice among a short, caller-owned set of options.",
            description: "Exclusive choice primitive",
            keywords: "radio group options fieldset legend orientation required disabled error sg-change",
            stageNote: "Arrow-key selection remains browser-native inside the generated fieldset",
            defaults: { value: "patrol", orientation: "horizontal", invalid: false, disabled: false },
            controls: [
                { key: "value", label: "Selected channel", type: "choice", options: [["dispatch", "Dispatch"], ["patrol", "Patrol"], ["tactical", "Tactical"]] },
                { key: "orientation", label: "Orientation", type: "choice", options: [["horizontal", "Horizontal"], ["vertical", "Vertical"]] },
                { key: "invalid", label: "Invalid", type: "boolean" },
                { key: "disabled", label: "Disabled", type: "boolean" }
            ],
            attributes: [
                ["label / name / value", "string", "Visible group label, shared native name, and current selection."],
                ["orientation", "horizontal | vertical", "Changes visual flow without replacing native radio behavior."],
                ["data-sg-option / value", "child hook", "Declares each caller-owned option; disabled is supported per option."],
                ["hint / error", "string", "Supporting guidance or recoverable validation message."],
                ["required / disabled / invalid", "boolean", "Native constraint and explicit group states."]
            ],
            events: [["sg-change", "{ value: string, name: string }", "Bubbles when the selected native radio changes."]],
            a11y: ["Builds a native fieldset, legend, and shared-name radio set.", "Browser-native arrow-key behavior is preserved and disabled options are skipped.", "Option text and selection markers remain visible at high zoom."],
            render: renderRadioGroup,
            markup: radioGroupMarkup
        },
        {
            id: "sg-textarea",
            name: "Textarea",
            icon: "message-square",
            category: "Forms",
            summary: "A labeled native multiline field with count, validation, read-only, and committed-event contracts.",
            description: "Multiline entry primitive",
            keywords: "textarea multiline input count maxlength readonly disabled invalid hint error sg-input sg-change",
            stageNote: "Type into the specimen to inspect continuous events and the live character count",
            defaults: { showCount: true, invalid: false, readonly: false, disabled: false },
            controls: [
                { key: "showCount", label: "Show count", type: "boolean" },
                { key: "invalid", label: "Invalid", type: "boolean" },
                { key: "readonly", label: "Read only", type: "boolean" },
                { key: "disabled", label: "Disabled", type: "boolean" }
            ],
            attributes: [
                ["label / value / name", "string", "Visible field label, current value, and event identity."],
                ["rows / minlength / maxlength", "number", "Native multiline sizing and length constraints."],
                ["placeholder / hint / error", "string", "Entry prompt, guidance, and recoverable validation text."],
                ["show-count", "boolean", "Displays current length and the maximum when present."],
                ["required / readonly / disabled / invalid", "boolean", "Native constraint and explicit field states."]
            ],
            events: [["sg-input", "{ value, name }", "Bubbles on live native input."], ["sg-change", "{ value, name }", "Bubbles when the native field commits."]],
            a11y: ["The visible label is associated with the native textarea and messages use aria-describedby.", "Invalid state exposes aria-invalid and explanatory text.", "Character count supplements, rather than replaces, maxlength enforcement."],
            render: renderTextarea,
            markup: textareaMarkup
        },
        {
            id: "sg-number-stepper",
            name: "Number stepper",
            icon: "plus",
            category: "Forms",
            summary: "A bounded native number field with explicit increment and decrement targets for precise quantities.",
            description: "Numeric adjustment primitive",
            keywords: "number stepper quantity min max step unit input buttons keyboard sg-input sg-change",
            stageNote: "Use the buttons or native number-field keyboard commands to update quantity",
            defaults: { value: "2", invalid: false, readonly: false, disabled: false },
            controls: [
                { key: "value", label: "Quantity", type: "choice", options: [["0", "0"], ["2", "2"], ["8", "8"], ["12", "12"]] },
                { key: "invalid", label: "Invalid", type: "boolean" },
                { key: "readonly", label: "Read only", type: "boolean" },
                { key: "disabled", label: "Disabled", type: "boolean" }
            ],
            attributes: [
                ["label / value / name", "string | number", "Visible label, current number, and event identity."],
                ["min / max / step", "number", "Native bounds and increment."],
                ["unit", "string", "Short visible suffix such as kg or rounds."],
                ["hint / error", "string", "Supporting guidance or recoverable validation message."],
                ["required / readonly / disabled / invalid", "boolean", "Native constraint and explicit field states."]
            ],
            events: [["sg-input", "{ value: number, name: string }", "Bubbles during native or button changes."], ["sg-change", "{ value: number, name: string }", "Bubbles when the new quantity commits."]],
            a11y: ["Uses a native number input with separately named increment and decrement buttons.", "Buttons disable at declared bounds and keyboard number-field behavior remains available.", "The unit is visible while the field label supplies the accessible context."],
            render: renderNumberStepper,
            markup: numberStepperMarkup
        },
        {
            id: "sg-chip",
            name: "Chip",
            icon: "x",
            category: "Actions",
            summary: "A compact filter or removable token with distinct selection and removal actions.",
            description: "Compact token primitive",
            keywords: "chip filter tag selected selectable removable disabled tone sg-change sg-remove",
            stageNote: "Selection and removal are separate focusable actions with separate events",
            defaults: { selected: true, selectable: true, removable: true, tone: "neutral", disabled: false },
            controls: [
                { key: "selected", label: "Selected", type: "boolean" },
                { key: "selectable", label: "Selectable", type: "boolean" },
                { key: "removable", label: "Removable", type: "boolean" },
                { key: "tone", label: "Tone", type: "choice", options: [["neutral", "Neutral"], ["success", "Success"], ["warning", "Warning"], ["danger", "Danger"], ["violet", "Violet"]] },
                { key: "disabled", label: "Disabled", type: "boolean" }
            ],
            attributes: [["label / value", "string", "Visible token text and stable event value."], ["selected / selectable / removable", "boolean", "Independent selection and removal affordances."], ["tone", "neutral | success | warning | danger | violet", "Semantic or rarity signal."], ["disabled", "boolean", "Blocks both actions."]],
            events: [["sg-change", "{ selected: boolean, value: string }", "Bubbles when selection toggles."], ["sg-remove", "{ value: string }", "Cancelable. Default behavior hides the chip."]],
            a11y: ["Selectable and removable actions use separate native buttons rather than nested controls.", "The selection button exposes aria-pressed and the remove action includes the chip label.", "Static chips remain noninteractive and are not placed in the tab order."],
            render: renderChip,
            markup: chipMarkup
        },
        {
            id: "sg-interaction-prompt",
            name: "Interaction prompt",
            icon: "hand",
            category: "Interactions",
            summary: "A focused world-interaction prompt that pairs one key with an explicit action and optional context.",
            description: "World interaction primitive",
            keywords: "interaction prompt key bind nearby world action disabled keyboard pointer sg-activate",
            stageNote: "The component communicates the available action; the consuming script still owns key capture and proximity rules",
            defaults: { tone: "primary", disabled: false },
            controls: [
                { key: "tone", label: "Tone", type: "choice", options: [["primary", "Primary"], ["success", "Success"], ["warning", "Warning"], ["danger", "Danger"]] },
                { key: "disabled", label: "Disabled", type: "boolean" }
            ],
            attributes: [["key", "string", "Visible input hint such as E, F, or G."], ["label / hint", "string", "Required action copy and optional supporting context."], ["icon", "sprite name", "Optional trailing context icon."], ["value", "string", "Stable action identity included in the event."], ["tone", "primary | success | warning | danger", "Semantic emphasis without changing behavior."], ["disabled", "boolean", "Blocks activation."]],
            events: [["sg-activate", "{ source, value }", "Bubbles after pointer, Enter, or Space activation."]],
            a11y: ["Uses a native button with a visible keycap and action label.", "The keycap is a hint, not a keyboard listener; scripts remain responsible for gameplay bindings.", "Disabled state removes the prompt from interaction without hiding its purpose."],
            render: renderInteractionPrompt,
            markup: interactionPromptMarkup
        },
        {
            id: "sg-action-list",
            name: "Action list",
            icon: "layers",
            category: "Interactions",
            summary: "A compact vertical command list with native buttons, roving focus, and one script-owned selection event.",
            description: "Command list primitive",
            keywords: "action list command menu inspect use give drop keyboard sg-action-select",
            stageNote: "Arrow keys move through enabled actions; each button value becomes the stable event identity",
            defaults: { compact: false, disabled: false },
            controls: [{ key: "compact", label: "Compact", type: "boolean" }, { key: "disabled", label: "Disabled", type: "boolean" }],
            attributes: [["label", "string", "Accessible name for the action collection."], ["child buttons", "HTML", "Caller-owned labels, values, icons, and disabled states."], ["compact", "boolean", "Reduces row height for dense menus."], ["disabled", "boolean", "Blocks all contained actions."]],
            events: [["sg-action-select", "{ value, label }", "Bubbles when an enabled action is chosen."], ["sg-close", "{ reason: 'escape' }", "Requests that a containing surface close."]],
            a11y: ["Uses native buttons inside a named menu region.", "Arrow keys, Home, and End move focus without replacing Enter and Space activation.", "Destructive choices require visible wording and should use a semantic icon or tone in their content."],
            render: renderActionList,
            markup: actionListMarkup
        },
        {
            id: "sg-confirm-progress",
            name: "Hold to confirm",
            icon: "clock",
            category: "Interactions",
            summary: "A press-and-hold confirmation control for consequential actions that should resist accidental activation.",
            description: "Hold confirmation primitive",
            keywords: "hold confirm progress interaction key duration cancel danger sg-confirm",
            stageNote: "Hold the specimen until the progress track completes; releasing early cancels without an event",
            defaults: { duration: "1200", tone: "warning", disabled: false },
            controls: [
                { key: "duration", label: "Duration", type: "choice", options: [["600", "0.6 seconds"], ["1200", "1.2 seconds"], ["2000", "2 seconds"]] },
                { key: "tone", label: "Tone", type: "choice", options: [["primary", "Primary"], ["success", "Success"], ["warning", "Warning"], ["danger", "Danger"]] },
                { key: "disabled", label: "Disabled", type: "boolean" }
            ],
            attributes: [["key", "string", "Visible input hint."], ["label / hint", "string", "Action and hold guidance."], ["duration", "300-10000", "Required hold duration in milliseconds."], ["value", "string", "Stable action identity."], ["tone", "primary | success | warning | danger", "Semantic progress signal."], ["disabled", "boolean", "Blocks confirmation."]],
            events: [["sg-confirm", "{ source, value, duration }", "Bubbles only after uninterrupted completion."]],
            a11y: ["Uses a native button and reports hold progress in its accessible name.", "Pointer release, key release, pointer cancellation, window blur, and disconnection cancel the hold.", "Reserve the pattern for consequential actions; ordinary commands should remain single activation buttons."],
            render: renderConfirmProgress,
            markup: confirmProgressMarkup
        },
        {
            id: "sg-popover",
            name: "Popover",
            icon: "info",
            category: "Interactions",
            summary: "A non-modal anchored surface for short contextual information or a small secondary action group.",
            description: "Anchored surface primitive",
            keywords: "popover anchored surface trigger placement outside escape focus sg-close",
            stageNote: "Open the specimen, then use Escape or click outside to verify dismissal and focus return",
            defaults: { placement: "bottom-start", autofocus: false, disabled: false },
            controls: [
                { key: "placement", label: "Placement", type: "choice", options: [["bottom-start", "Bottom start"], ["bottom-end", "Bottom end"], ["top-start", "Top start"], ["top-end", "Top end"], ["right", "Right"], ["left", "Left"]] },
                { key: "autofocus", label: "Autofocus content", type: "boolean" },
                { key: "disabled", label: "Disabled", type: "boolean" }
            ],
            attributes: [["open", "boolean", "Caller-readable open state."], ["label", "string", "Accessible content-surface name."], ["placement", "six anchored positions", "Positions content relative to the trigger."], ["autofocus", "boolean", "Moves focus into interactive content when opened."], ["data-sg-trigger / data-sg-content", "child hooks", "Declare the trigger and contextual surface."], ["disabled", "boolean", "Blocks opening."]],
            events: [["sg-close", "{ reason: 'escape' | 'outside' | 'trigger' }", "Cancelable dismissal request."]],
            a11y: ["Connects trigger and content with aria-controls and aria-expanded.", "The content is a named non-modal dialog and Escape restores focus.", "Use a modal when the task requires protected focus or interruption."],
            render: renderPopover,
            markup: popoverMarkup
        },
        {
            id: "sg-context-menu",
            name: "Context menu",
            icon: "square-stack",
            category: "Interactions",
            summary: "A viewport-clamped pointer menu for script-owned actions at a requested screen position.",
            description: "Pointer menu primitive",
            keywords: "context menu right click x y position actions keyboard outside sg-action-select sg-close",
            stageNote: "The catalogue uses an illustrative position; consumers supply actual pointer coordinates",
            defaults: { keepOpen: false, disabled: false },
            controls: [{ key: "keepOpen", label: "Keep open", type: "boolean" }, { key: "disabled", label: "Disabled", type: "boolean" }],
            attributes: [["open", "boolean", "Caller-readable visibility state."], ["x / y", "number", "Requested viewport coordinates, clamped to visible bounds."], ["label", "string", "Accessible menu name."], ["child buttons", "HTML", "Caller-owned actions and values."], ["keep-open", "boolean", "Prevents selection from automatically closing the menu."], ["disabled", "boolean", "Blocks all contained actions."]],
            events: [["sg-action-select", "{ value, label }", "Bubbles when an enabled action is chosen."], ["sg-close", "{ reason: 'selection' | 'escape' | 'outside' }", "Cancelable dismissal request."]],
            a11y: ["Uses a named native-button menu and focuses the first action when opened.", "Arrow keys, Home, End, Escape, and outside-pointer dismissal are supported.", "Opening scripts should supply the pointer position and return focus to the originating object."],
            render: renderContextMenu,
            markup: contextMenuMarkup
        },
        {
            id: "sg-radial-menu",
            name: "Radial menu",
            icon: "circle",
            category: "Interactions",
            summary: "A four-to-eight action wheel with native buttons, ordered keyboard navigation, and a compact central anchor.",
            description: "Quick action wheel",
            keywords: "radial menu wheel actions quick keyboard icons segments sg-action-select sg-close",
            stageNote: "Directional keys move through actions in clockwise DOM order; visual position never changes script values",
            defaults: { count: "6", iconOnly: false, keepOpen: false, disabled: false },
            controls: [
                { key: "count", label: "Segments", type: "choice", options: [["4", "Four"], ["6", "Six"], ["8", "Eight"]] },
                { key: "iconOnly", label: "Icon only", type: "boolean" },
                { key: "keepOpen", label: "Keep open", type: "boolean" },
                { key: "disabled", label: "Disabled", type: "boolean" }
            ],
            attributes: [["open", "boolean", "Caller-readable visibility state."], ["label", "string", "Accessible wheel name."], ["center-icon", "sprite name", "Decorative center marker."], ["icon-only", "boolean", "Hides visible labels while preserving each button's accessible name."], ["child buttons", "4-8 native buttons", "Clockwise caller-owned actions with stable values."], ["data-selected / data-active / data-locked", "child state hooks", "Persistent selection, held action, and unavailable-condition treatments."], ["keep-open", "boolean", "Prevents selection from automatically closing the wheel."], ["disabled", "boolean", "Blocks every action."]],
            events: [["sg-action-select", "{ value, label }", "Bubbles when an enabled segment is chosen."], ["sg-close", "{ reason: 'selection' | 'escape' }", "Cancelable dismissal request."]],
            a11y: ["Visual segments remain native buttons in meaningful clockwise DOM order.", "Directional keys, Home, End, Enter, Space, and Escape are supported.", "Do not rely on icons or wheel position alone; every action keeps visible text."],
            render: renderRadialMenu,
            markup: radialMenuMarkup
        },
        {
            id: "sg-breadcrumb",
            name: "Breadcrumb",
            icon: "chevron-right",
            category: "Navigation",
            summary: "A compact navigation trail that preserves caller-owned links and marks the current location.",
            description: "Location trail primitive",
            keywords: "breadcrumb navigation trail links current page hierarchy chevron",
            stageNote: "Links and destinations remain ordinary caller-owned markup",
            defaults: { depth: "4" },
            controls: [{ key: "depth", label: "Trail depth", type: "choice", options: [["2", "Two"], ["3", "Three"], ["4", "Four"]] }],
            attributes: [["label", "string", "Accessible name for the navigation landmark."], ["child anchors / spans", "HTML", "Caller-owned destinations and current-page copy."]],
            events: [],
            a11y: ["Creates a named navigation landmark with an ordered list.", "The final item receives aria-current=page unless the caller already supplied it.", "Separators are hidden from assistive technology and long trails truncate visually."],
            render: renderBreadcrumb,
            markup: breadcrumbMarkup
        },
        {
            id: "sg-pagination",
            name: "Pagination",
            icon: "chevron-right",
            category: "Navigation",
            summary: "A compact page-request control that exposes the requested page while leaving remote data ownership to scripts.",
            description: "Page request primitive",
            keywords: "pagination pages previous next current total siblings disabled navigation sg-change",
            stageNote: "The component requests a page; the consuming script still owns loading and data",
            defaults: { page: "6", total: "12", size: "md", disabled: false },
            controls: [
                { key: "page", label: "Current page", type: "choice", options: [["1", "1"], ["3", "3"], ["6", "6"], ["12", "12"]] },
                { key: "total", label: "Total pages", type: "choice", options: [["4", "4"], ["12", "12"], ["24", "24"]] },
                { key: "size", label: "Size", type: "choice", options: [["sm", "Small"], ["md", "Medium"], ["lg", "Large"]] },
                { key: "disabled", label: "Disabled", type: "boolean" }
            ],
            attributes: [["page / total", "positive integer", "Current page and total available pages."], ["siblings", "0 | 1 | 2 | 3", "Number of neighboring pages around the current page."], ["size", "sm | md | lg", "Shared control sizing."], ["label", "string", "Accessible navigation landmark name."], ["disabled", "boolean", "Blocks all page requests."]],
            events: [["sg-change", "{ page: number, previousPage: number }", "Bubbles when a different page is requested."]],
            a11y: ["Uses a named navigation landmark and native buttons.", "The current page is identified with aria-current and readable button text.", "Previous and next actions disable at bounds; ellipses are noninteractive."],
            render: renderPagination,
            markup: paginationMarkup
        },
        {
            id: "sg-progress",
            name: "Progress",
            icon: "radio",
            category: "Data display",
            summary: "A native linear progress indicator with bounded values, semantic tones, and a deliberate indeterminate state.",
            description: "Linear progress primitive",
            keywords: "progress loading completion percent value max indeterminate tone size native",
            stageNote: "Use progress only for a real bounded process; indeterminate state communicates unknown duration",
            defaults: { value: "68", tone: "primary", size: "md", showValue: true, indeterminate: false },
            controls: [
                { key: "value", label: "Completion", type: "choice", options: [["18", "18%"], ["48", "48%"], ["68", "68%"], ["100", "100%"]] },
                { key: "tone", label: "Tone", type: "choice", options: [["primary", "Primary"], ["success", "Success"], ["warning", "Warning"], ["danger", "Danger"], ["violet", "Violet"]] },
                { key: "size", label: "Size", type: "choice", options: [["sm", "Small"], ["md", "Medium"], ["lg", "Large"]] },
                { key: "showValue", label: "Show value", type: "boolean" },
                { key: "indeterminate", label: "Indeterminate", type: "boolean" }
            ],
            attributes: [["label", "string", "Visible process name."], ["value / max", "number", "Current bounded value and maximum."], ["tone", "primary | success | warning | danger | violet", "Semantic process signal."], ["size", "sm | md | lg", "Track thickness."], ["show-value / indeterminate", "boolean", "Visible percentage and unknown-duration state."], ["detail", "string", "Optional supporting progress context."]],
            events: [],
            a11y: ["Uses a native progress element associated with its visible label.", "Indeterminate progress omits the native value rather than inventing a percentage.", "Text and native semantics communicate state without relying on color."],
            render: renderProgress,
            markup: progressMarkup
        },
        {
            id: "sg-meter",
            name: "Circular meter",
            icon: "circle",
            category: "Data display",
            summary: "A compact circular reading backed by a native meter for bounded status values such as stamina or capacity.",
            description: "Bounded status primitive",
            keywords: "meter circular ring status capacity stamina value min max low high optimum unit",
            stageNote: "The ring supplements an exact value, label, and native meter semantics",
            defaults: { value: "64", tone: "warning", size: "md" },
            controls: [
                { key: "value", label: "Value", type: "choice", options: [["18", "18%"], ["48", "48%"], ["64", "64%"], ["92", "92%"]] },
                { key: "tone", label: "Tone", type: "choice", options: [["primary", "Primary"], ["success", "Success"], ["warning", "Warning"], ["danger", "Danger"], ["violet", "Violet"]] },
                { key: "size", label: "Size", type: "choice", options: [["sm", "Small"], ["md", "Medium"], ["lg", "Large"]] }
            ],
            attributes: [["label", "string", "Visible measurement name."], ["value / min / max", "number", "Current reading and bounds."], ["low / high / optimum", "number", "Optional native meter thresholds."], ["unit", "string", "Short visible suffix."], ["tone / size", "string", "Semantic signal and geometry."], ["detail", "string", "Optional supporting reading."]],
            events: [],
            a11y: ["A native meter carries the accessible measurement semantics.", "The circular rendering is hidden from assistive technology and always includes an exact text value.", "Choose semantic tones from script-owned thresholds rather than visual preference."],
            render: renderMeter,
            markup: meterMarkup
        },
        {
            id: "sg-avatar",
            name: "Avatar",
            icon: "user",
            category: "Identity",
            summary: "A resilient player identity image with initials fallback, compact sizing, and optional availability status.",
            description: "Identity image primitive",
            keywords: "avatar profile player image initials fallback status online away busy size shape",
            stageNote: "The initials fallback requires no external asset and remains visible when an image fails",
            defaults: { size: "lg", shape: "circle", status: "online" },
            controls: [
                { key: "size", label: "Size", type: "choice", options: [["sm", "Small"], ["md", "Medium"], ["lg", "Large"], ["xl", "Extra large"]] },
                { key: "shape", label: "Shape", type: "choice", options: [["circle", "Circle"], ["square", "Square"]] },
                { key: "status", label: "Status", type: "choice", options: [["online", "Online"], ["away", "Away"], ["busy", "Busy"], ["", "None"]] }
            ],
            attributes: [["src", "local image URL", "Optional caller-owned image asset."], ["alt", "string", "Accessible identity label and image alternative."], ["initials", "string", "Fallback text when no image is available."], ["size", "sm | md | lg | xl", "Shared avatar scale."], ["shape", "circle | square", "Identity geometry."], ["status", "online | away | busy", "Optional visible availability marker."]],
            events: [],
            a11y: ["The alt value names the identity rather than describing the image style.", "Initials remain available when a local image is absent or fails.", "Availability status needs nearby text when it changes a decision; the colored dot is supplementary."],
            render: renderAvatar,
            markup: avatarMarkup
        },
        {
            id: "sg-list-row",
            name: "List row",
            icon: "layers",
            category: "Data display",
            summary: "A compact record row with stable label, detail, metadata, optional icon, trailing content, and selection state.",
            description: "Record row primitive",
            keywords: "list row record label detail meta selectable selected disabled trailing sg-item-activate",
            stageNote: "The primary selection target and trailing actions remain separate native controls",
            defaults: { selected: false, selectable: true, disabled: false },
            controls: [{ key: "selected", label: "Selected", type: "boolean" }, { key: "selectable", label: "Selectable", type: "boolean" }, { key: "disabled", label: "Disabled", type: "boolean" }],
            attributes: [["label / detail / meta", "string", "Primary, supporting, and aligned metadata."], ["icon", "sprite name", "Optional leading bundled icon."], ["value", "string", "Stable caller-owned event value."], ["selectable / selected / disabled", "boolean", "Interaction and availability states."], ["child content", "HTML", "Optional separate trailing actions or badges."]],
            events: [["sg-item-activate", "{ label, selected, value }", "Bubbles when the primary row selection changes."]],
            a11y: ["Selectable rows use a native button with aria-pressed.", "Trailing caller actions are siblings rather than nested inside the row button.", "Long labels and detail truncate visually while the accessible label remains intact."],
            render: renderListRow,
            markup: listRowMarkup
        },
        {
            id: "sg-empty-state",
            name: "Empty state",
            icon: "package",
            category: "Feedback",
            summary: "A quiet zero-data state with a specific explanation and an optional caller-owned recovery action.",
            description: "No-data primitive",
            keywords: "empty state no data no results filters recovery action compact icon",
            stageNote: "Describe why the region is empty and offer only a relevant recovery action",
            defaults: { compact: false, action: true },
            controls: [{ key: "compact", label: "Compact", type: "boolean" }, { key: "action", label: "Show recovery", type: "boolean" }],
            attributes: [["label", "string", "Specific empty-state heading."], ["description", "string", "Cause, context, or useful next step."], ["icon", "sprite name", "Optional supporting icon."], ["compact", "boolean", "Reduced-height placement."], ["child content", "HTML", "Optional caller-owned recovery actions."]],
            events: [],
            a11y: ["Creates a named region connected to its title and description.", "The icon is decorative; visible copy communicates the actual condition.", "Recovery actions retain their own native component semantics."],
            render: renderEmptyState,
            markup: emptyStateMarkup
        },
        {
            id: "sg-skeleton",
            name: "Skeleton",
            icon: "columns-3",
            category: "Feedback",
            summary: "A restrained loading placeholder for text, media, or avatar geometry with reduced-motion support.",
            description: "Loading placeholder primitive",
            keywords: "skeleton loading placeholder shimmer text circle rect lines animated aria busy",
            stageNote: "Skeletons reserve layout; the containing region should own aria-busy and its loading message",
            defaults: { shape: "text", lines: "3", animated: true },
            controls: [
                { key: "shape", label: "Shape", type: "choice", options: [["text", "Text"], ["circle", "Circle"], ["rect", "Rectangle"]] },
                { key: "lines", label: "Lines", type: "choice", options: [["1", "One"], ["3", "Three"], ["5", "Five"]] },
                { key: "animated", label: "Animated", type: "boolean" }
            ],
            attributes: [["shape", "text | circle | rect", "Reserved content geometry."], ["lines", "1–6", "Text-line count."], ["width / height", "safe CSS length", "Optional bounded dimensions."], ["animated", "boolean", "Loading sweep disabled by reduced-motion preference."], ["label", "string", "Optional standalone status announcement; omit inside an already labeled busy region."]],
            events: [],
            a11y: ["Unlabeled skeletons are hidden from assistive technology.", "Use one loading announcement on the containing region rather than announcing every placeholder.", "Reduced-motion preference removes the sweep while preserving geometry."],
            render: renderSkeleton,
            markup: skeletonMarkup
        },
        {
            id: "sg-data-table",
            name: "Data table",
            icon: "columns-3",
            category: "Data display",
            summary: "A responsive viewport for caller-owned native tables with compact, striped, and sticky-header treatments.",
            description: "Tabular data primitive",
            keywords: "data table native rows columns responsive scroll compact striped sticky header",
            stageNote: "Use a table only when row and column relationships matter; scripts own sorting and data",
            defaults: { compact: false, striped: false, stickyHeader: false },
            controls: [{ key: "compact", label: "Compact", type: "boolean" }, { key: "striped", label: "Striped", type: "boolean" }, { key: "stickyHeader", label: "Sticky header", type: "boolean" }],
            attributes: [["label", "string", "Accessible region and table name."], ["compact / striped / sticky-header", "boolean", "Density and scanning treatments."], ["child table", "native HTML", "Caller-owned caption, headers, rows, and cells."]],
            events: [],
            a11y: ["Preserves native table, thead, tbody, th, and scope semantics.", "Horizontal overflow stays inside the named table region at narrow widths.", "Interactive sorting or row actions remain explicit native buttons supplied by the consumer."],
            render: renderDataTable,
            markup: dataTableMarkup
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

        ["sg-activate", "sg-input", "sg-change", "sg-item-activate", "sg-action-select", "sg-confirm", "sg-dismiss", "sg-close", "sg-remove"].forEach(function (eventName) {
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

    function renderCheckbox(state) {
        return "<div class=\"stage-stack\">" + checkboxMarkup(state) + "<sg-checkbox label=\"Mixed selection\" indeterminate hint=\"Indeterminate is a visual state set by the script.\"></sg-checkbox></div>";
    }

    function checkboxMarkup(state) {
        var attributes = ["label=\"Share radio location\"", "name=\"share-location\"", "value=\"enabled\"", "hint=\"Visible to members of your current channel.\""];
        if (state.checked) attributes.push("checked");
        if (state.indeterminate) attributes.push("indeterminate");
        if (state.invalid) attributes.push("error=\"Confirm this choice before continuing.\"");
        if (state.disabled) attributes.push("disabled");
        return "<sg-checkbox " + attributes.join(" ") + "></sg-checkbox>";
    }

    function renderRadioGroup(state) {
        return "<div class=\"stage-stack\">" + radioGroupMarkup(state) + "<p class=\"stage-caption\">Native radio semantics keep one channel selected at a time.</p></div>";
    }

    function radioGroupMarkup(state) {
        var attributes = ["label=\"Duty channel\"", "name=\"duty-channel\"", "value=\"" + state.value + "\"", "orientation=\"" + state.orientation + "\"", "hint=\"Choose one active channel.\""];
        if (state.invalid) attributes.push("error=\"Select an available duty channel.\"");
        if (state.disabled) attributes.push("disabled");
        return "<sg-radio-group " + attributes.join(" ") + ">\n" +
            "  <span data-sg-option value=\"dispatch\">Dispatch</span>\n" +
            "  <span data-sg-option value=\"patrol\">Patrol</span>\n" +
            "  <span data-sg-option value=\"tactical\">Tactical</span>\n" +
            "</sg-radio-group>";
    }

    function renderTextarea(state) {
        return "<div class=\"stage-stack\">" + textareaMarkup(state) + "<p class=\"stage-caption\">The count updates locally while scripts decide when and where to store the note.</p></div>";
    }

    function textareaMarkup(state) {
        var attributes = ["label=\"Dispatch note\"", "name=\"dispatch-note\"", "value=\"Unit en route to Pillbox Hill.\"", "rows=\"4\"", "maxlength=\"140\"", "hint=\"Include location and immediate risk.\""];
        if (state.showCount) attributes.push("show-count");
        if (state.invalid) attributes.push("error=\"Add a location before sending.\"");
        if (state.readonly) attributes.push("readonly");
        if (state.disabled) attributes.push("disabled");
        return "<sg-textarea " + attributes.join(" ") + "></sg-textarea>";
    }

    function renderNumberStepper(state) {
        return "<div class=\"stage-stack\">" + numberStepperMarkup(state) + "<p class=\"stage-caption\">Bounds disable unavailable actions without hiding the quantity.</p></div>";
    }

    function numberStepperMarkup(state) {
        var attributes = ["label=\"Bandage quantity\"", "name=\"bandage-quantity\"", "value=\"" + state.value + "\"", "min=\"0\"", "max=\"12\"", "step=\"1\"", "unit=\"items\"", "hint=\"Available stack: 12.\""];
        if (state.invalid) attributes.push("error=\"Quantity exceeds the available stack.\"");
        if (state.readonly) attributes.push("readonly");
        if (state.disabled) attributes.push("disabled");
        return "<sg-number-stepper " + attributes.join(" ") + "></sg-number-stepper>";
    }

    function renderChip(state) {
        return "<div class=\"stage-stack\"><div class=\"stage-row\">" + chipMarkup(state) + "<sg-chip tone=\"success\">On duty</sg-chip><sg-chip selectable value=\"medical\">Medical</sg-chip></div><p class=\"stage-caption\">Remove hides this specimen unless a consumer cancels sg-remove.</p></div>";
    }

    function chipMarkup(state) {
        var attributes = ["value=\"weapons\"", "tone=\"" + state.tone + "\""];
        if (state.selected) attributes.push("selected");
        if (state.selectable) attributes.push("selectable");
        if (state.removable) attributes.push("removable");
        if (state.disabled) attributes.push("disabled");
        return "<sg-chip " + attributes.join(" ") + ">Weapons</sg-chip>";
    }

    function renderInteractionPrompt(state) {
        return "<div class=\"stage-stack\">" + interactionPromptMarkup(state) + "<sg-interaction-prompt key=\"F\" label=\"Pick up bandage\" hint=\"Hold for more options\" icon=\"package\" value=\"pickup-bandage\"></sg-interaction-prompt></div>";
    }

    function interactionPromptMarkup(state) {
        var attributes = ["key=\"E\"", "label=\"Talk to Jordan Carter\"", "hint=\"2.4 m away\"", "icon=\"message-square\"", "value=\"talk-player\"", "tone=\"" + state.tone + "\""];
        if (state.disabled) attributes.push("disabled");
        return "<sg-interaction-prompt " + attributes.join(" ") + "></sg-interaction-prompt>";
    }

    function renderActionList(state) {
        return "<div class=\"stage-stack\">" + actionListMarkup(state) + "<p class=\"stage-caption\">Native buttons keep values and disabled rules under script ownership.</p></div>";
    }

    function actionListMarkup(state) {
        var attributes = ["label=\"Player actions\""];
        if (state.compact) attributes.push("compact");
        if (state.disabled) attributes.push("disabled");
        return "<sg-action-list " + attributes.join(" ") + ">\n" +
            "  <button value=\"talk\" data-icon=\"message-square\">Talk</button>\n" +
            "  <button value=\"give\" data-icon=\"package\">Give item</button>\n" +
            "  <button value=\"follow\" data-icon=\"users\">Follow</button>\n" +
            "  <button value=\"search\" data-icon=\"search\" disabled>Search</button>\n" +
            "</sg-action-list>";
    }

    function renderConfirmProgress(state) {
        return "<div class=\"stage-stack\">" + confirmProgressMarkup(state) + "<p class=\"stage-caption\">Releasing before completion resets the control and emits nothing.</p></div>";
    }

    function confirmProgressMarkup(state) {
        var attributes = ["key=\"E\"", "label=\"Pick lock\"", "hint=\"Keep holding to complete\"", "duration=\"" + state.duration + "\"", "value=\"pick-lock\"", "tone=\"" + state.tone + "\""];
        if (state.disabled) attributes.push("disabled");
        return "<sg-confirm-progress " + attributes.join(" ") + "></sg-confirm-progress>";
    }

    function renderPopover(state) {
        return "<div class=\"popover-stage\">" + popoverMarkup(state) + "</div>";
    }

    function popoverMarkup(state) {
        var attributes = ["label=\"Vehicle details\"", "placement=\"" + state.placement + "\""];
        if (state.autofocus) attributes.push("autofocus");
        if (state.disabled) attributes.push("disabled");
        return "<sg-popover " + attributes.join(" ") + ">\n" +
            "  <sg-button data-sg-trigger>Vehicle details</sg-button>\n" +
            "  <section data-sg-content>\n" +
            "    <strong>Buffalo STX</strong>\n" +
            "    <p>Stored at Pillbox Garage. Fuel 78%.</p>\n" +
            "    <sg-button size=\"sm\">Set waypoint</sg-button>\n" +
            "  </section>\n" +
            "</sg-popover>";
    }

    function renderContextMenu(state) {
        return "<div class=\"stage-stack\"><sg-button data-demo-open=\"context-menu\">Open context menu</sg-button>" + contextMenuMarkup(state) + "<p class=\"stage-caption\">The menu clamps its requested coordinates to the current viewport.</p></div>";
    }

    function contextMenuMarkup(state) {
        var attributes = ["label=\"Inventory actions\"", "x=\"420\"", "y=\"260\""];
        if (state.keepOpen) attributes.push("keep-open");
        if (state.disabled) attributes.push("disabled");
        return "<sg-context-menu " + attributes.join(" ") + ">\n" +
            "  <button value=\"use\" data-icon=\"hand\">Use item</button>\n" +
            "  <button value=\"give\" data-icon=\"users\">Give to player</button>\n" +
            "  <button value=\"inspect\" data-icon=\"search\">Inspect</button>\n" +
            "  <button value=\"drop\" data-icon=\"x\">Drop item</button>\n" +
            "</sg-context-menu>";
    }

    function renderRadialMenu(state) {
        return "<div class=\"stage-stack radial-stage\"><sg-button data-demo-open=\"radial-menu\">Open action wheel</sg-button>" + radialMenuMarkup(state) + "</div>";
    }

    function radialMenuMarkup(state) {
        var actions = [
            ["talk", "message-square", "Talk"],
            ["give", "package", "Give"],
            ["follow", "users", "Follow"],
            ["search", "search", "Search"],
            ["vehicle", "car", "Vehicle"],
            ["inventory", "backpack", "Inventory"],
            ["radio", "radio", "Radio"],
            ["more", "lock", "More", true]
        ];
        var count = Math.max(4, Math.min(8, Number(state.count) || 6));
        var attributes = ["label=\"Quick actions\"", "center-icon=\"zap\""];
        if (state.iconOnly) attributes.push("icon-only");
        if (state.keepOpen) attributes.push("keep-open");
        if (state.disabled) attributes.push("disabled");
        var buttons = actions.slice(0, count).map(function (action) {
            var stateAttributes = action[3] ? " data-locked disabled" : "";
            return "  <button value=\"" + action[0] + "\" data-icon=\"" + action[1] + "\"" + stateAttributes + ">" + action[2] + "</button>";
        });
        return "<sg-radial-menu " + attributes.join(" ") + ">\n" + buttons.join("\n") + "\n</sg-radial-menu>";
    }

    function renderBreadcrumb(state) {
        return "<div class=\"stage-stack\">" + breadcrumbMarkup(state) + "<p class=\"stage-caption\">The current location is text; prior levels remain ordinary links.</p></div>";
    }

    function breadcrumbMarkup(state) {
        var items = ["<a href=\"#overview\">Dashboard</a>", "<a href=\"#players\">Players</a>", "<a href=\"#jordan\">Jordan Carter</a>", "<span>Inventory</span>"];
        var depth = Math.max(2, Math.min(4, Number(state.depth) || 4));
        return "<sg-breadcrumb label=\"Current location\">\n  " + items.slice(items.length - depth).join("\n  ") + "\n</sg-breadcrumb>";
    }

    function renderPagination(state) {
        return "<div class=\"stage-stack\">" + paginationMarkup(state) + "<p class=\"stage-caption\">A request event changes the local page marker; scripts fetch and render the actual results.</p></div>";
    }

    function paginationMarkup(state) {
        var page = Math.min(Number(state.page) || 1, Number(state.total) || 1);
        var attributes = ["label=\"Inventory pages\"", "page=\"" + page + "\"", "total=\"" + state.total + "\"", "siblings=\"1\"", "size=\"" + state.size + "\""];
        if (state.disabled) attributes.push("disabled");
        return "<sg-pagination " + attributes.join(" ") + "></sg-pagination>";
    }

    function renderProgress(state) {
        return "<div class=\"stage-stack\">" + progressMarkup(state) + "<sg-progress label=\"Connecting to dispatch\" indeterminate detail=\"Waiting for the server.\"></sg-progress></div>";
    }

    function progressMarkup(state) {
        var attributes = ["label=\"Lockpicking\"", "max=\"100\"", "tone=\"" + state.tone + "\"", "size=\"" + state.size + "\"", "detail=\"Level 12 skill progress.\""];
        if (state.indeterminate) attributes.push("indeterminate");
        else attributes.push("value=\"" + state.value + "\"");
        if (state.showValue) attributes.push("show-value");
        return "<sg-progress " + attributes.join(" ") + "></sg-progress>";
    }

    function renderMeter(state) {
        return "<div class=\"stage-row\">" + meterMarkup(state) + "<sg-meter label=\"Stamina\" value=\"82\" unit=\"%\" tone=\"success\" detail=\"Ready\"></sg-meter></div>";
    }

    function meterMarkup(state) {
        return "<sg-meter label=\"Hunger\" value=\"" + state.value + "\" min=\"0\" max=\"100\" unit=\"%\" tone=\"" + state.tone + "\" size=\"" + state.size + "\" detail=\"Current status\"></sg-meter>";
    }

    function renderAvatar(state) {
        return "<div class=\"stage-row\">" + avatarMarkup(state) + "<sg-avatar initials=\"AM\" alt=\"Alex Morgan\" size=\"md\" status=\"away\"></sg-avatar><sg-avatar initials=\"LS\" alt=\"Los Santos dispatch\" size=\"sm\" shape=\"square\"></sg-avatar></div>";
    }

    function avatarMarkup(state) {
        var attributes = ["initials=\"JC\"", "alt=\"Jordan Carter\"", "size=\"" + state.size + "\"", "shape=\"" + state.shape + "\""];
        if (state.status) attributes.push("status=\"" + state.status + "\"");
        return "<sg-avatar " + attributes.join(" ") + "></sg-avatar>";
    }

    function renderListRow(state) {
        return "<div class=\"stage-stack\">" + listRowMarkup(state) + "<sg-list-row icon=\"car\" label=\"Buffalo STX\" detail=\"Vehicle · Stored\" meta=\"LS 4821\"><sg-badge tone=\"success\">Available</sg-badge></sg-list-row></div>";
    }

    function listRowMarkup(state) {
        var attributes = ["icon=\"user\"", "label=\"Jordan Carter\"", "detail=\"Civilian · ID 2501\"", "meta=\"2.4 m\"", "value=\"2501\""];
        if (state.selectable) attributes.push("selectable");
        if (state.selected) attributes.push("selected");
        if (state.disabled) attributes.push("disabled");
        return "<sg-list-row " + attributes.join(" ") + ">\n  <sg-badge tone=\"info\">Nearby</sg-badge>\n</sg-list-row>";
    }

    function renderEmptyState(state) {
        return "<div class=\"stage-stack\">" + emptyStateMarkup(state) + "</div>";
    }

    function emptyStateMarkup(state) {
        var attributes = ["icon=\"users\"", "label=\"No players found\"", "description=\"Try adjusting your search or clearing the active filters.\""];
        if (state.compact) attributes.push("compact");
        var action = state.action ? "\n  <sg-button size=\"sm\">Clear filters</sg-button>\n" : "";
        return "<sg-empty-state " + attributes.join(" ") + ">" + action + "</sg-empty-state>";
    }

    function renderSkeleton(state) {
        return "<div class=\"skeleton-stage\"><div class=\"stage-row stage-row--start\">" + skeletonMarkup(state) + "<sg-skeleton shape=\"circle\" width=\"48px\" height=\"48px\" animated></sg-skeleton></div><sg-skeleton shape=\"rect\" height=\"88px\" animated></sg-skeleton></div>";
    }

    function skeletonMarkup(state) {
        var attributes = ["shape=\"" + state.shape + "\"", "lines=\"" + state.lines + "\""];
        if (state.shape === "circle") attributes.push("width=\"48px\"", "height=\"48px\"");
        if (state.shape === "rect") attributes.push("height=\"88px\"");
        if (state.animated) attributes.push("animated");
        return "<sg-skeleton " + attributes.join(" ") + "></sg-skeleton>";
    }

    function renderDataTable(state) {
        return "<div class=\"stage-stack\">" + dataTableMarkup(state) + "<p class=\"stage-caption\">Illustrative records demonstrate table structure only; scripts supply the real dataset.</p></div>";
    }

    function dataTableMarkup(state) {
        var attributes = ["label=\"Online players\""];
        if (state.compact) attributes.push("compact");
        if (state.striped) attributes.push("striped");
        if (state.stickyHeader) attributes.push("sticky-header");
        return "<sg-data-table " + attributes.join(" ") + ">\n" +
            "  <table>\n" +
            "    <thead><tr><th scope=\"col\">Player</th><th scope=\"col\">Job</th><th scope=\"col\">Ping</th><th scope=\"col\">Status</th></tr></thead>\n" +
            "    <tbody>\n" +
            "      <tr><td>Jordan Carter</td><td>Civilian</td><td>48 ms</td><td>Online</td></tr>\n" +
            "      <tr><td>Alex Morgan</td><td>Police</td><td>62 ms</td><td>On duty</td></tr>\n" +
            "      <tr><td>Maya Chen</td><td>EMS</td><td>71 ms</td><td>Available</td></tr>\n" +
            "    </tbody>\n" +
            "  </table>\n" +
            "</sg-data-table>";
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
