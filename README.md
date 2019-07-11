# oas-changelog
> An attempt at a swagger changelog generator for the Meraki API.

Generates a `changelog.md` and `changelog.json` file based on differences of two swagger / OAS v2 docs. 


## Run
```
node index.js -o "./oas-files/Meraki openapiSpec 20-apr-19.json" -n "./oas-files/Meraki openapiSpec 26-apr-19.json"
```

## View
Generated files are in the `output` directory


```
- **Major**: `/networks/{network_id}/sm/devices/move` - Deleted
- **Major**: `/networks/{network_id}/sm/devices/{deviceId}/unenroll` - Deleted
- **Major**: `/networks/{network_id}/sm/profiles` - Deleted
- **Major**: `/networks/{network_id}/sm/{id}/cellularUsageHistory` - Deleted
- **Major**: `/networks/{networkId}/syslogServers` (put) - Param `updateNetworkSyslogServers` became required
- **Major**: `/networks/{networkId}/connectionStats` (get) - Param `ssid` type turn from from `string` to `integer`
- **Major**: `/networks/{networkId}/connectionStats` (get) - Param `vlan` type turn from from `string` to `integer`
- **Major**: `/networks/{networkId}/devices/connectionStats` (get) - Param `ssid` type turn from from `string` to `integer`
```

## Dev Notes

based on `swagger-diff` and `swagger-changelog`
most modifications are with the `message` parameter formatting. 