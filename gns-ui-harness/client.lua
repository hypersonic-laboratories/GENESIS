local harness_ui = WebUI('Genesis UI Harness', 'gns-ui-harness/html/index.html')
local is_open = false

local function setHarnessOpen(next_open)
    if not harness_ui then
        return
    end

    is_open = next_open

    if is_open then
        harness_ui:BringToFront()
        harness_ui:SetInputMode(1)
        harness_ui:SendEvent('gnsui:setVisible', { visible = true })
        return
    end

    harness_ui:SendEvent('gnsui:setVisible', { visible = false })
    harness_ui:SetInputMode(0)
end

harness_ui:RegisterEventHandler('gnsui:close', function()
    setHarnessOpen(false)
end)

Input.BindKey('F10', function()
    setHarnessOpen(not is_open)
end, 'Released')

function onShutdown()
    if harness_ui then
        harness_ui:SetInputMode(0)
        harness_ui:Destroy()
        harness_ui = nil
    end
end
