--[[
    Genesis UI harness.

    The page is built from Scripts/gns-ui/packages/harness and emitted into
    html/build/. Nothing in html/build/ is edited by hand.

        cd Scripts/gns-ui
        bun run build:harness     -- one-off
        bun run watch:harness     -- rebuild on save

    Press F10 in game to toggle the interface.
]]

local harness_ui = WebUI('Genesis UI Harness', 'gns-ui-harness/html/build/index.html')
local is_open = false

local function setHarnessOpen(next_open)
    if not harness_ui then
        return
    end

    is_open = next_open

    -- The page is always loaded and always composited. Input mode is what
    -- decides whether the player is driving the UI or the game, so it has to
    -- be released on close or the world stops responding to the mouse.
    if is_open then
        harness_ui:BringToFront()
        harness_ui:SetInputMode(1)
        harness_ui:SendEvent('gnsui:setVisible', true)
        return
    end

    harness_ui:SendEvent('gnsui:setVisible', false)
    harness_ui:SetInputMode(0)
end

-- The page asks to be dismissed (Escape, close button, Leave).
harness_ui:RegisterEventHandler('gnsui:close', function()
    setHarnessOpen(false)
end)

-- Round-trip check: proves hEvent's callback path works inside the client.
harness_ui:RegisterEventHandler('gnsui:ping', function(data, callback)
    if callback then
        callback({
            ok = true,
            at = os.date('%H:%M:%S'),
            from = data and data.from or 'unknown',
        })
    end
end)

--[[
    Form submission.

    The screen sends what the player typed; this decides whether it is
    acceptable and replies with the verdict. Keys in `errors` must match the
    form's field names — that is how each message finds its field.

    Real handlers would validate against the server rather than inline here.
]]
harness_ui:RegisterEventHandler('gnsui:profile', function(values, callback)
    if not callback then
        return
    end

    values = values or {}
    local errors = {}

    local display_name = tostring(values.displayName or '')
    if #display_name < 3 then
        errors.displayName = 'Must be at least 3 characters.'
    end

    if values.region == 'banned' then
        errors.region = 'That region is not accepting connections.'
    end

    local motd = tostring(values.motd or '')
    if #motd > 40 then
        errors.motd = string.format('%d characters over the limit.', #motd - 40)
    end

    if next(errors) ~= nil then
        callback({ ok = false, errors = errors })
        return
    end

    print(string.format('[gns-ui] profile saved: %s', display_name))
    callback({ ok = true, message = 'Profile saved on the server.' })
end)

-- Forwards log() calls from the page to the Lua console.
harness_ui:RegisterEventHandler('gnsui:log', function(data)
    if not data then
        return
    end

    local level = string.upper(tostring(data.level or 'info'))
    print(string.format('[gns-ui][%s] %s', level, tostring(data.message)))
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
