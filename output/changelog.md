Meraki Dashboard API Changelog

Changelog
=========

Version 0.6.0 to 1.0.0-beta

Changes
-------

#### PATH

> Base path turned from `/api/v0` to `/api/v1`

* * *

### SSIDs

**Update the attributes of an SSID**

#### PUT

`/networks/{networkId}/ssids/{number}`

> Property `walledGardenRanges` type turn from `string` to `array`

* * *

### Networks

**Update a network**

#### PUT

`/networks/{networkId}`

> Property `enrollmentString` Deleted

* * *

**Create a network**

#### POST

`/organizations/{organizationId}/networks`

> **Required property** `productTypes` Added

> Property `type` Deleted

* * *

**Combine multiple networks into a single network**

#### POST

`/organizations/{organizationId}/networks/combine`

> Property `enrollmentString` Deleted

* * *

### Organizations

**Return the device inventory for an organization**

#### GET

`/organizations/{organizationId}/inventory`

> Param `includeLicenseInfo` Deleted

> Optional param `perPage` added

> Optional param `startingAfter` added

> Optional param `endingBefore` added

> Response property `orderNumber` value added:
> 
>            
>             {
>               orderNumber: "4C1234567"
>             }
>     

> Response property `licenseExpirationDate` value added:
> 
>            
>             {
>               licenseExpirationDate: "2020-05-02T10:52:44.012345Z"
>             }
>     

> Response property `headers` value added:
> 
>            
>             {
>               headers: {"Link":{"type":"string","description":"A comma-separated list of first, last, prev, and next relative links used for subsequent paginated requests."}}
>             }
>     

> Summary changed from `Return the inventory for an organization` to `Return the device inventory for an organization`

* * *

Renamed
-------

#### PATH

`/networks/{networkId}/devices/{serial}`

> Path `/networks/{networkId}/devices/{serial}` renamed to `/devices/{serial}`

* * *

#### PATH

`/networks/{networkId}/devices/{serial}/blinkLeds`

> Path `/networks/{networkId}/devices/{serial}/blinkLeds` renamed to `/devices/{serial}/blinkLeds`

* * *

#### PATH

`/networks/{networkId}/devices/{serial}/lldp_cdp`

> Path `/networks/{networkId}/devices/{serial}/lldp_cdp` renamed to `/devices/{serial}/lldpCdp`

* * *

#### PATH

`/networks/{networkId}/devices/{serial}/lossAndLatencyHistory`

> Path `/networks/{networkId}/devices/{serial}/lossAndLatencyHistory` renamed to `/devices/{serial}/lossAndLatencyHistory`

* * *

#### PATH

`/networks/{networkId}/devices/{serial}/performance`

> Path `/networks/{networkId}/devices/{serial}/performance` renamed to `/devices/{serial}/performance`

* * *

#### PATH

`/networks/{networkId}/devices/{serial}/reboot`

> Path `/networks/{networkId}/devices/{serial}/reboot` renamed to `/devices/{serial}/reboot`

* * *

#### PATH

`/networks/{networkId}/devices/{serial}/remove`

> Path `/networks/{networkId}/devices/{serial}/remove` renamed to `/networks/{networkId}/devices/remove`

* * *

#### PATH

`/networks/{networkId}/devices/{serial}/uplink`

> Path `/networks/{networkId}/devices/{serial}/uplink` renamed to `/devices/{serial}/uplink`

* * *