local p = nil

local function MiniGame(str, time)
    if not str or str < 1 then str = 1 end
    if not time or time < 1 then time = 10 end
    p = promise.new()
    SendNUIMessage({
        action = 'start',
        string = str,
		time = time,
    })
    SetNuiFocus(true, true)
    local result = Citizen.Await(p)
    return result
end

RegisterNUICallback('fail', function(data, cb)
    p:resolve(false)
    p = nil
    SetNuiFocus(false, false)
    cb('ok')
end)

RegisterNUICallback('success', function(data, cb)
    p:resolve(true)
    p = nil
    SetNuiFocus(false, false)
    cb('ok')
end)

exports("MiniGame", MiniGame)

RegisterCommand('boostingmemory', function(source, args, rawCommand)
   local success = exports['kd_boostingmemory']:MiniGame(tonumber(args[1]), tonumber(args[2]))
   print(success)
end)