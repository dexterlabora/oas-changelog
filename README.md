# oas-changelog
> An attempt at a swagger changelog generator for the Meraki API.

Generates a `changelog.md` and `changelog.json` file based on differences of two swagger / OAS v2 docs. 


## Run
```
node index.js -o "./oas-files/Meraki openapiSpec 20-apr-19.json" -n "./oas-files/Meraki openapiSpec 26-apr-19.json"
```

## View
Generated files are in the `./output/` directory

*changelog.md*
```
- **Major**: `/organizations/{organizationId}/admins` (post) - OperationId turned from `createOrganizationAdmins` to `createOrganizationAdmin`
- **Major**: `/devices/{serial}/camera/analytics/zones/{zoneId}/history` - Deleted
- **Major**: `/organizations/{organizationId}/networks` (post) - OperationId turned from `createOrganizationNetworks` to `createOrganizationNetwork`
- **Major**: `/networks/{networkId}/cameras/{serial}/snapshot` (post) - OperationId turned from `snapshotNetworkCamera` to `generateNetworkCameraSnapshot`
- **Major**: `/networks/{networkId}/devices/{serial}/blinkLeds` (post) - OperationId turned from `blinkLedsNetworkDevice` to `blinkNetworkDeviceLeds`
- **Major**: `/networks/{networkId}/groupPolicies` (post) - OperationId turned from `createNetworkGroupPolicies` to `createNetworkGroupPolicy`
- **Major**: `/networks/{networkId}/httpServers` (post) - OperationId turned from `createNetworkHttpServers` to `createNetworkHttpServer`
- **Major**: `/networks/{networkId}/httpServers/webhookTests` (post) - OperationId turned from `createNetworkHttpServersWebhookTests` to `createNetworkHttpServersWebhookTest`
- **Major**: `/organizations` (post) - OperationId turned from `createOrganizations` to `createOrganization`
```

*changelog.json*
```
[
  {
    "ruleId": "edit-operation-id",
    "message": "`/organizations/{organizationId}/admins` (post) - OperationId turned from `createOrganizationAdmins` to `createOrganizationAdmin`",
    "path": "/organizations/{organizationId}/admins",
    "method": "post",
    "previousOperationId": "createOrganizationAdmins",
    "currentOperationId": "createOrganizationAdmin",
    "type": "warnings"
  },
  {
    "ruleId": "delete-path",
    "message": "`/devices/{serial}/camera/analytics/zones/{zoneId}/history` - Deleted",
    "path": "/devices/{serial}/camera/analytics/zones/{zoneId}/history",
    "type": "warnings"
  },
  {
    "ruleId": "edit-operation-id",
    "message": "`/organizations/{organizationId}/networks` (post) - OperationId turned from `createOrganizationNetworks` to `createOrganizationNetwork`",
    "path": "/organizations/{organizationId}/networks",
    "method": "post",
    "previousOperationId": "createOrganizationNetworks",
    "currentOperationId": "createOrganizationNetwork",
    "type": "warnings"
  },
  ...
```

## Dev Notes

based on `swagger-diff` and `swagger-changelog`
most customizations are with the `message` parameter formatting. 