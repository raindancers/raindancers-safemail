# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### EmailReporting <a name="EmailReporting" id="raindancers-safemail.emailSecurity.EmailReporting"></a>

#### Initializers <a name="Initializers" id="raindancers-safemail.emailSecurity.EmailReporting.Initializer"></a>

```typescript
import { emailSecurity } from 'raindancers-safemail'

new emailSecurity.EmailReporting(scope: Construct, id: string, props: EmailReportingProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#raindancers-safemail.emailSecurity.EmailReporting.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#raindancers-safemail.emailSecurity.EmailReporting.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#raindancers-safemail.emailSecurity.EmailReporting.Initializer.parameter.props">props</a></code> | <code>raindancers-safemail.emailSecurity.EmailReportingProps</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="raindancers-safemail.emailSecurity.EmailReporting.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="raindancers-safemail.emailSecurity.EmailReporting.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="raindancers-safemail.emailSecurity.EmailReporting.Initializer.parameter.props"></a>

- *Type:* raindancers-safemail.emailSecurity.EmailReportingProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#raindancers-safemail.emailSecurity.EmailReporting.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#raindancers-safemail.emailSecurity.EmailReporting.with">with</a></code> | Applies one or more mixins to this construct. |

---

##### `toString` <a name="toString" id="raindancers-safemail.emailSecurity.EmailReporting.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `with` <a name="with" id="raindancers-safemail.emailSecurity.EmailReporting.with"></a>

```typescript
public with(mixins: ...IMixin[]): IConstruct
```

Applies one or more mixins to this construct.

Mixins are applied in order. The list of constructs is captured at the
start of the call, so constructs added by a mixin will not be visited.
Use multiple `with()` calls if subsequent mixins should apply to added
constructs.

###### `mixins`<sup>Required</sup> <a name="mixins" id="raindancers-safemail.emailSecurity.EmailReporting.with.parameter.mixins"></a>

- *Type:* ...constructs.IMixin[]

The mixins to apply.

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#raindancers-safemail.emailSecurity.EmailReporting.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="raindancers-safemail.emailSecurity.EmailReporting.isConstruct"></a>

```typescript
import { emailSecurity } from 'raindancers-safemail'

emailSecurity.EmailReporting.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="raindancers-safemail.emailSecurity.EmailReporting.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#raindancers-safemail.emailSecurity.EmailReporting.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#raindancers-safemail.emailSecurity.EmailReporting.property.bucket">bucket</a></code> | <code>aws-cdk-lib.aws_s3.Bucket</code> | *No description.* |
| <code><a href="#raindancers-safemail.emailSecurity.EmailReporting.property.eventBus">eventBus</a></code> | <code>aws-cdk-lib.aws_events.EventBus</code> | *No description.* |
| <code><a href="#raindancers-safemail.emailSecurity.EmailReporting.property.parserFunction">parserFunction</a></code> | <code>aws-cdk-lib.aws_lambda.Function</code> | *No description.* |
| <code><a href="#raindancers-safemail.emailSecurity.EmailReporting.property.receiptRuleSet">receiptRuleSet</a></code> | <code>aws-cdk-lib.aws_ses.ReceiptRuleSet</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="raindancers-safemail.emailSecurity.EmailReporting.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `bucket`<sup>Required</sup> <a name="bucket" id="raindancers-safemail.emailSecurity.EmailReporting.property.bucket"></a>

```typescript
public readonly bucket: Bucket;
```

- *Type:* aws-cdk-lib.aws_s3.Bucket

---

##### `eventBus`<sup>Required</sup> <a name="eventBus" id="raindancers-safemail.emailSecurity.EmailReporting.property.eventBus"></a>

```typescript
public readonly eventBus: EventBus;
```

- *Type:* aws-cdk-lib.aws_events.EventBus

---

##### `parserFunction`<sup>Required</sup> <a name="parserFunction" id="raindancers-safemail.emailSecurity.EmailReporting.property.parserFunction"></a>

```typescript
public readonly parserFunction: Function;
```

- *Type:* aws-cdk-lib.aws_lambda.Function

---

##### `receiptRuleSet`<sup>Required</sup> <a name="receiptRuleSet" id="raindancers-safemail.emailSecurity.EmailReporting.property.receiptRuleSet"></a>

```typescript
public readonly receiptRuleSet: ReceiptRuleSet;
```

- *Type:* aws-cdk-lib.aws_ses.ReceiptRuleSet

---


### EmailSecurity <a name="EmailSecurity" id="raindancers-safemail.emailSecurity.EmailSecurity"></a>

CDK construct that adds email security DNS records to a Route53 hosted zone.

Call the `add*` methods to publish SPF, DKIM, DMARC, MTA-STS, and TLS-RPT records.

*Example*

```typescript
const emailSec = new EmailSecurity(this, 'EmailSecurity', { hostedZone });

emailSec.addSpf({ include: [SpfInclude.MICROSOFT_365], all: SpfQualifier.FAIL });
emailSec.addMicrosoft365Dkim();
emailSec.addDmarc({ policy: DmarcPolicy.REJECT, percentage: 100 });
emailSec.addMtaSts({ mode: MtaStsMode.ENFORCE });
emailSec.addTlsRpt();
```


#### Initializers <a name="Initializers" id="raindancers-safemail.emailSecurity.EmailSecurity.Initializer"></a>

```typescript
import { emailSecurity } from 'raindancers-safemail'

new emailSecurity.EmailSecurity(scope: Construct, id: string, props: EmailSecurityProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#raindancers-safemail.emailSecurity.EmailSecurity.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#raindancers-safemail.emailSecurity.EmailSecurity.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#raindancers-safemail.emailSecurity.EmailSecurity.Initializer.parameter.props">props</a></code> | <code>raindancers-safemail.emailSecurity.EmailSecurityProps</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="raindancers-safemail.emailSecurity.EmailSecurity.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="raindancers-safemail.emailSecurity.EmailSecurity.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="raindancers-safemail.emailSecurity.EmailSecurity.Initializer.parameter.props"></a>

- *Type:* raindancers-safemail.emailSecurity.EmailSecurityProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#raindancers-safemail.emailSecurity.EmailSecurity.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#raindancers-safemail.emailSecurity.EmailSecurity.with">with</a></code> | Applies one or more mixins to this construct. |
| <code><a href="#raindancers-safemail.emailSecurity.EmailSecurity.addAlerts">addAlerts</a></code> | Deploys the `EmailReporting` construct which receives DMARC and TLS-RPT reports, parses them, and sends HTML alert emails for failures. |
| <code><a href="#raindancers-safemail.emailSecurity.EmailSecurity.addDkim">addDkim</a></code> | Publishes a DKIM public key as a TXT record (`<name>._domainkey.<domain>`). Use this when you manage your own DKIM keys. For managed providers use `addDkimCname()`, `addMicrosoft365Dkim()`, or `addSesDkim()`. |
| <code><a href="#raindancers-safemail.emailSecurity.EmailSecurity.addDkimCname">addDkimCname</a></code> | Publishes a single DKIM CNAME record (`<name>._domainkey.<domain>` → `<target>`). Used by providers (SES, Microsoft 365) that manage DKIM keys on your behalf. |
| <code><a href="#raindancers-safemail.emailSecurity.EmailSecurity.addDkimCnames">addDkimCnames</a></code> | Convenience wrapper that calls `addDkimCname()` for each selector in the array. |
| <code><a href="#raindancers-safemail.emailSecurity.EmailSecurity.addDmarc">addDmarc</a></code> | Publishes a DMARC TXT record at `_dmarc.<domain>`. |
| <code><a href="#raindancers-safemail.emailSecurity.EmailSecurity.addMtaSts">addMtaSts</a></code> | Publishes an MTA-STS policy requiring TLS for inbound mail delivery. |
| <code><a href="#raindancers-safemail.emailSecurity.EmailSecurity.addSesDkim">addSesDkim</a></code> | Publishes SES DKIM CNAME records from known token values. |
| <code><a href="#raindancers-safemail.emailSecurity.EmailSecurity.addSesDkimFromIdentity">addSesDkimFromIdentity</a></code> | Automatically fetches the three SES DKIM tokens for the domain at deploy time using a custom resource, then publishes the CNAME records. |
| <code><a href="#raindancers-safemail.emailSecurity.EmailSecurity.addSpf">addSpf</a></code> | Publishes an SPF TXT record at the root of the domain. |
| <code><a href="#raindancers-safemail.emailSecurity.EmailSecurity.addTlsRpt">addTlsRpt</a></code> | Publishes a TLS-RPT record (`_smtp._tls.<domain>`) requesting TLS failure reports from sending servers. |

---

##### `toString` <a name="toString" id="raindancers-safemail.emailSecurity.EmailSecurity.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `with` <a name="with" id="raindancers-safemail.emailSecurity.EmailSecurity.with"></a>

```typescript
public with(mixins: ...IMixin[]): IConstruct
```

Applies one or more mixins to this construct.

Mixins are applied in order. The list of constructs is captured at the
start of the call, so constructs added by a mixin will not be visited.
Use multiple `with()` calls if subsequent mixins should apply to added
constructs.

###### `mixins`<sup>Required</sup> <a name="mixins" id="raindancers-safemail.emailSecurity.EmailSecurity.with.parameter.mixins"></a>

- *Type:* ...constructs.IMixin[]

The mixins to apply.

---

##### `addAlerts` <a name="addAlerts" id="raindancers-safemail.emailSecurity.EmailSecurity.addAlerts"></a>

```typescript
public addAlerts(config: AddAlertsConfig): void
```

Deploys the `EmailReporting` construct which receives DMARC and TLS-RPT reports, parses them, and sends HTML alert emails for failures.

Also updates the DMARC `rua` and TLS-RPT `rua` records to point to the report domain.
Call `addDmarc()` and `addTlsRpt()` **before** `addAlerts()` so the records exist to be updated.

*Example*

```typescript
emailSec.addDmarc({ policy: DmarcPolicy.REJECT, percentage: 100 });
emailSec.addTlsRpt();
emailSec.addAlerts({
  reportDomain: 'reports.example.com',
  alertEmail: 'security@example.com',
  sesRegion: 'ap-southeast-2',
});
```


###### `config`<sup>Required</sup> <a name="config" id="raindancers-safemail.emailSecurity.EmailSecurity.addAlerts.parameter.config"></a>

- *Type:* raindancers-safemail.emailSecurity.AddAlertsConfig

---

##### `addDkim` <a name="addDkim" id="raindancers-safemail.emailSecurity.EmailSecurity.addDkim"></a>

```typescript
public addDkim(selector: DkimSelector): void
```

Publishes a DKIM public key as a TXT record (`<name>._domainkey.<domain>`). Use this when you manage your own DKIM keys. For managed providers use `addDkimCname()`, `addMicrosoft365Dkim()`, or `addSesDkim()`.

*Example*

```typescript
emailSec.addDkim({
  name: 'default',
  publicKey: 'p=MIGfMA0GCSqGSIb3DQEBAQUAA4GN...',
});
```


###### `selector`<sup>Required</sup> <a name="selector" id="raindancers-safemail.emailSecurity.EmailSecurity.addDkim.parameter.selector"></a>

- *Type:* raindancers-safemail.emailSecurity.DkimSelector

---

##### `addDkimCname` <a name="addDkimCname" id="raindancers-safemail.emailSecurity.EmailSecurity.addDkimCname"></a>

```typescript
public addDkimCname(selector: DkimCnameSelector): void
```

Publishes a single DKIM CNAME record (`<name>._domainkey.<domain>` → `<target>`). Used by providers (SES, Microsoft 365) that manage DKIM keys on your behalf.

*Example*

```typescript
emailSec.addDkimCname({
  name: 'abc123',
  target: 'abc123.dkim.amazonses.com',
});
```


###### `selector`<sup>Required</sup> <a name="selector" id="raindancers-safemail.emailSecurity.EmailSecurity.addDkimCname.parameter.selector"></a>

- *Type:* raindancers-safemail.emailSecurity.DkimCnameSelector

---

##### `addDkimCnames` <a name="addDkimCnames" id="raindancers-safemail.emailSecurity.EmailSecurity.addDkimCnames"></a>

```typescript
public addDkimCnames(selectors: DkimCnameSelector[]): void
```

Convenience wrapper that calls `addDkimCname()` for each selector in the array.

*Example*

```typescript
emailSec.addDkimCnames([
  { name: 'abc123', target: 'abc123.dkim.amazonses.com' },
  { name: 'def456', target: 'def456.dkim.amazonses.com' },
]);
```


###### `selectors`<sup>Required</sup> <a name="selectors" id="raindancers-safemail.emailSecurity.EmailSecurity.addDkimCnames.parameter.selectors"></a>

- *Type:* raindancers-safemail.emailSecurity.DkimCnameSelector[]

---

##### `addDmarc` <a name="addDmarc" id="raindancers-safemail.emailSecurity.EmailSecurity.addDmarc"></a>

```typescript
public addDmarc(config: DmarcConfig): void
```

Publishes a DMARC TXT record at `_dmarc.<domain>`.

If `addAlerts()` will also be called, omit `rua` — it will be set automatically.
Call `addDmarc()` before `addAlerts()` so the record exists to be updated.

*Example*

```typescript
emailSec.addDmarc({
  policy: DmarcPolicy.REJECT,
  percentage: 100,
});
// Produces: "v=DMARC1; p=reject; pct=100"
```


###### `config`<sup>Required</sup> <a name="config" id="raindancers-safemail.emailSecurity.EmailSecurity.addDmarc.parameter.config"></a>

- *Type:* raindancers-safemail.emailSecurity.DmarcConfig

---

##### `addMtaSts` <a name="addMtaSts" id="raindancers-safemail.emailSecurity.EmailSecurity.addMtaSts"></a>

```typescript
public addMtaSts(config: AddMtaStsConfig): void
```

Publishes an MTA-STS policy requiring TLS for inbound mail delivery.

Creates a cross-region nested stack in `us-east-1` (required for CloudFront)
that hosts the policy file at `https://mta-sts.<domain>/.well-known/mta-sts.txt`
and adds the `_mta-sts` TXT DNS record.

**Important:** The nested stack must be deployed separately:
```
npx cdk deploy "MyStack/MyStack-MtaSts"
```

*Example*

```typescript
emailSec.addMtaSts({ mode: MtaStsMode.ENFORCE });
```


###### `config`<sup>Required</sup> <a name="config" id="raindancers-safemail.emailSecurity.EmailSecurity.addMtaSts.parameter.config"></a>

- *Type:* raindancers-safemail.emailSecurity.AddMtaStsConfig

---

##### `addSesDkim` <a name="addSesDkim" id="raindancers-safemail.emailSecurity.EmailSecurity.addSesDkim"></a>

```typescript
public addSesDkim(tokens: string[]): void
```

Publishes SES DKIM CNAME records from known token values.

Use this when you already have the three DKIM tokens from SES
(e.g. retrieved manually or from another stack output).
Prefer `addSesDkimFromIdentity()` to fetch tokens automatically at deploy time.

*Example*

```typescript
emailSec.addSesDkim(['abc123', 'def456', 'ghi789']);
```


###### `tokens`<sup>Required</sup> <a name="tokens" id="raindancers-safemail.emailSecurity.EmailSecurity.addSesDkim.parameter.tokens"></a>

- *Type:* string[]

The three DKIM token strings provided by SES.

---

##### `addSesDkimFromIdentity` <a name="addSesDkimFromIdentity" id="raindancers-safemail.emailSecurity.EmailSecurity.addSesDkimFromIdentity"></a>

```typescript
public addSesDkimFromIdentity(sesRegion?: string): void
```

Automatically fetches the three SES DKIM tokens for the domain at deploy time using a custom resource, then publishes the CNAME records.

Requires the SES identity for the domain to already exist in the target region.
The custom resource calls `ses:getIdentityDkimAttributes` during deployment.

*Example*

```typescript
// SES identity is in a different region
emailSec.addSesDkimFromIdentity('us-east-1');
```


###### `sesRegion`<sup>Optional</sup> <a name="sesRegion" id="raindancers-safemail.emailSecurity.EmailSecurity.addSesDkimFromIdentity.parameter.sesRegion"></a>

- *Type:* string

Region where the SES identity exists.

Defaults to the stack region.

---

##### `addSpf` <a name="addSpf" id="raindancers-safemail.emailSecurity.EmailSecurity.addSpf"></a>

```typescript
public addSpf(config: SpfConfig): void
```

Publishes an SPF TXT record at the root of the domain.

Builds the record from the provided mechanisms in RFC 7208 order:
`ip4` → `ip6` → `a` → `mx` → `include` → `all`.

*Example*

```typescript
// Microsoft 365 + SES only, reject everything else
emailSec.addSpf({
  include: [SpfInclude.MICROSOFT_365, SpfInclude.AMAZON_SES],
  all: SpfQualifier.FAIL,
});
// Produces: "v=spf1 include:spf.protection.outlook.com include:amazonses.com -all"
```


###### `config`<sup>Required</sup> <a name="config" id="raindancers-safemail.emailSecurity.EmailSecurity.addSpf.parameter.config"></a>

- *Type:* raindancers-safemail.emailSecurity.SpfConfig

---

##### `addTlsRpt` <a name="addTlsRpt" id="raindancers-safemail.emailSecurity.EmailSecurity.addTlsRpt"></a>

```typescript
public addTlsRpt(reportEmail?: string): void
```

Publishes a TLS-RPT record (`_smtp._tls.<domain>`) requesting TLS failure reports from sending servers.

If `addAlerts()` is also called, omit `reportEmail` — it will be set automatically
to `tls-reports@<reportDomain>`.

*Example*

```typescript
// Custom address
emailSec.addTlsRpt('tls@reports.example.com');
```


###### `reportEmail`<sup>Optional</sup> <a name="reportEmail" id="raindancers-safemail.emailSecurity.EmailSecurity.addTlsRpt.parameter.reportEmail"></a>

- *Type:* string

Address to receive TLS-RPT reports.

Defaults to `tls-reports@<domain>`.

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#raindancers-safemail.emailSecurity.EmailSecurity.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="raindancers-safemail.emailSecurity.EmailSecurity.isConstruct"></a>

```typescript
import { emailSecurity } from 'raindancers-safemail'

emailSecurity.EmailSecurity.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="raindancers-safemail.emailSecurity.EmailSecurity.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#raindancers-safemail.emailSecurity.EmailSecurity.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#raindancers-safemail.emailSecurity.EmailSecurity.property.domain">domain</a></code> | <code>string</code> | *No description.* |
| <code><a href="#raindancers-safemail.emailSecurity.EmailSecurity.property.hostedZone">hostedZone</a></code> | <code>aws-cdk-lib.aws_route53.IHostedZone</code> | *No description.* |
| <code><a href="#raindancers-safemail.emailSecurity.EmailSecurity.property.emailReporting">emailReporting</a></code> | <code>raindancers-safemail.emailSecurity.EmailReporting</code> | *No description.* |
| <code><a href="#raindancers-safemail.emailSecurity.EmailSecurity.property.mtaStsStack">mtaStsStack</a></code> | <code>raindancers-safemail.emailSecurity.MtaStsStack</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="raindancers-safemail.emailSecurity.EmailSecurity.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `domain`<sup>Required</sup> <a name="domain" id="raindancers-safemail.emailSecurity.EmailSecurity.property.domain"></a>

```typescript
public readonly domain: string;
```

- *Type:* string

---

##### `hostedZone`<sup>Required</sup> <a name="hostedZone" id="raindancers-safemail.emailSecurity.EmailSecurity.property.hostedZone"></a>

```typescript
public readonly hostedZone: IHostedZone;
```

- *Type:* aws-cdk-lib.aws_route53.IHostedZone

---

##### `emailReporting`<sup>Optional</sup> <a name="emailReporting" id="raindancers-safemail.emailSecurity.EmailSecurity.property.emailReporting"></a>

```typescript
public readonly emailReporting: EmailReporting;
```

- *Type:* raindancers-safemail.emailSecurity.EmailReporting

---

##### `mtaStsStack`<sup>Optional</sup> <a name="mtaStsStack" id="raindancers-safemail.emailSecurity.EmailSecurity.property.mtaStsStack"></a>

```typescript
public readonly mtaStsStack: MtaStsStack;
```

- *Type:* raindancers-safemail.emailSecurity.MtaStsStack

---


### MtaStsStack <a name="MtaStsStack" id="raindancers-safemail.emailSecurity.MtaStsStack"></a>

#### Initializers <a name="Initializers" id="raindancers-safemail.emailSecurity.MtaStsStack.Initializer"></a>

```typescript
import { emailSecurity } from 'raindancers-safemail'

new emailSecurity.MtaStsStack(scope: Construct, id: string, props: MtaStsStackProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.Initializer.parameter.props">props</a></code> | <code>raindancers-safemail.emailSecurity.MtaStsStackProps</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="raindancers-safemail.emailSecurity.MtaStsStack.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="raindancers-safemail.emailSecurity.MtaStsStack.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="raindancers-safemail.emailSecurity.MtaStsStack.Initializer.parameter.props"></a>

- *Type:* raindancers-safemail.emailSecurity.MtaStsStackProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.with">with</a></code> | Applies one or more mixins to this construct. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.addDependency">addDependency</a></code> | Add a dependency between this stack and another stack. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.addMetadata">addMetadata</a></code> | Adds an arbitrary key-value pair, with information you want to record about the stack. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.addStackTag">addStackTag</a></code> | Configure a stack tag. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.addTransform">addTransform</a></code> | Add a Transform to this stack. A Transform is a macro that AWS CloudFormation uses to process your template. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.exportStringListValue">exportStringListValue</a></code> | Create a CloudFormation Export for a string list value. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.exportValue">exportValue</a></code> | Create a CloudFormation Export for a string value. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.formatArn">formatArn</a></code> | Creates an ARN from components. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.getLogicalId">getLogicalId</a></code> | Allocates a stack-unique CloudFormation-compatible logical identity for a specific resource. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.regionalFact">regionalFact</a></code> | Look up a fact value for the given fact for the region of this stack. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.removeStackTag">removeStackTag</a></code> | Remove a stack tag. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.renameLogicalId">renameLogicalId</a></code> | Rename a generated logical identities. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.reportMissingContextKey">reportMissingContextKey</a></code> | Indicate that a context key was expected. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.resolve">resolve</a></code> | Resolve a tokenized value in the context of the current stack. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.splitArn">splitArn</a></code> | Splits the provided ARN into its components. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.toJsonString">toJsonString</a></code> | Convert an object, potentially containing tokens, to a JSON string. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.toYamlString">toYamlString</a></code> | Convert an object, potentially containing tokens, to a YAML string. |

---

##### `toString` <a name="toString" id="raindancers-safemail.emailSecurity.MtaStsStack.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `with` <a name="with" id="raindancers-safemail.emailSecurity.MtaStsStack.with"></a>

```typescript
public with(mixins: ...IMixin[]): IConstruct
```

Applies one or more mixins to this construct.

Mixins are applied in order. The list of constructs is captured at the
start of the call, so constructs added by a mixin will not be visited.
Use multiple `with()` calls if subsequent mixins should apply to added
constructs.

###### `mixins`<sup>Required</sup> <a name="mixins" id="raindancers-safemail.emailSecurity.MtaStsStack.with.parameter.mixins"></a>

- *Type:* ...constructs.IMixin[]

The mixins to apply.

---

##### `addDependency` <a name="addDependency" id="raindancers-safemail.emailSecurity.MtaStsStack.addDependency"></a>

```typescript
public addDependency(target: Stack, reason?: string): void
```

Add a dependency between this stack and another stack.

This can be used to define dependencies between any two stacks within an
app, and also supports nested stacks.

###### `target`<sup>Required</sup> <a name="target" id="raindancers-safemail.emailSecurity.MtaStsStack.addDependency.parameter.target"></a>

- *Type:* aws-cdk-lib.Stack

---

###### `reason`<sup>Optional</sup> <a name="reason" id="raindancers-safemail.emailSecurity.MtaStsStack.addDependency.parameter.reason"></a>

- *Type:* string

---

##### `addMetadata` <a name="addMetadata" id="raindancers-safemail.emailSecurity.MtaStsStack.addMetadata"></a>

```typescript
public addMetadata(key: string, value: any): void
```

Adds an arbitrary key-value pair, with information you want to record about the stack.

These get translated to the Metadata section of the generated template.

> [https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/metadata-section-structure.html](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/metadata-section-structure.html)

###### `key`<sup>Required</sup> <a name="key" id="raindancers-safemail.emailSecurity.MtaStsStack.addMetadata.parameter.key"></a>

- *Type:* string

---

###### `value`<sup>Required</sup> <a name="value" id="raindancers-safemail.emailSecurity.MtaStsStack.addMetadata.parameter.value"></a>

- *Type:* any

---

##### `addStackTag` <a name="addStackTag" id="raindancers-safemail.emailSecurity.MtaStsStack.addStackTag"></a>

```typescript
public addStackTag(tagName: string, tagValue: string): void
```

Configure a stack tag.

At deploy time, CloudFormation will automatically apply all stack tags to all resources in the stack.

###### `tagName`<sup>Required</sup> <a name="tagName" id="raindancers-safemail.emailSecurity.MtaStsStack.addStackTag.parameter.tagName"></a>

- *Type:* string

---

###### `tagValue`<sup>Required</sup> <a name="tagValue" id="raindancers-safemail.emailSecurity.MtaStsStack.addStackTag.parameter.tagValue"></a>

- *Type:* string

---

##### `addTransform` <a name="addTransform" id="raindancers-safemail.emailSecurity.MtaStsStack.addTransform"></a>

```typescript
public addTransform(transform: string): void
```

Add a Transform to this stack. A Transform is a macro that AWS CloudFormation uses to process your template.

Duplicate values are removed when stack is synthesized.

> [https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/transform-section-structure.html](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/transform-section-structure.html)

*Example*

```typescript
declare const stack: Stack;

stack.addTransform('AWS::Serverless-2016-10-31')
```


###### `transform`<sup>Required</sup> <a name="transform" id="raindancers-safemail.emailSecurity.MtaStsStack.addTransform.parameter.transform"></a>

- *Type:* string

The transform to add.

---

##### `exportStringListValue` <a name="exportStringListValue" id="raindancers-safemail.emailSecurity.MtaStsStack.exportStringListValue"></a>

```typescript
public exportStringListValue(exportedValue: any, options?: ExportValueOptions): string[]
```

Create a CloudFormation Export for a string list value.

Returns a string list representing the corresponding `Fn.importValue()`
expression for this Export. The export expression is automatically wrapped with an
`Fn::Join` and the import value with an `Fn::Split`, since CloudFormation can only
export strings. You can control the name for the export by passing the `name` option.

If you don't supply a value for `name`, the value you're exporting must be
a Resource attribute (for example: `bucket.bucketName`) and it will be
given the same name as the automatic cross-stack reference that would be created
if you used the attribute in another Stack.

One of the uses for this method is to *remove* the relationship between
two Stacks established by automatic cross-stack references. It will
temporarily ensure that the CloudFormation Export still exists while you
remove the reference from the consuming stack. After that, you can remove
the resource and the manual export.

See `exportValue` for an example of this process.

###### `exportedValue`<sup>Required</sup> <a name="exportedValue" id="raindancers-safemail.emailSecurity.MtaStsStack.exportStringListValue.parameter.exportedValue"></a>

- *Type:* any

---

###### `options`<sup>Optional</sup> <a name="options" id="raindancers-safemail.emailSecurity.MtaStsStack.exportStringListValue.parameter.options"></a>

- *Type:* aws-cdk-lib.ExportValueOptions

---

##### `exportValue` <a name="exportValue" id="raindancers-safemail.emailSecurity.MtaStsStack.exportValue"></a>

```typescript
public exportValue(exportedValue: any, options?: ExportValueOptions): string
```

Create a CloudFormation Export for a string value.

Returns a string representing the corresponding `Fn.importValue()`
expression for this Export. You can control the name for the export by
passing the `name` option.

If you don't supply a value for `name`, the value you're exporting must be
a Resource attribute (for example: `bucket.bucketName`) and it will be
given the same name as the automatic cross-stack reference that would be created
if you used the attribute in another Stack.

One of the uses for this method is to *remove* the relationship between
two Stacks established by automatic cross-stack references. It will
temporarily ensure that the CloudFormation Export still exists while you
remove the reference from the consuming stack. After that, you can remove
the resource and the manual export.

Here is how the process works. Let's say there are two stacks,
`producerStack` and `consumerStack`, and `producerStack` has a bucket
called `bucket`, which is referenced by `consumerStack` (perhaps because
an AWS Lambda Function writes into it, or something like that).

It is not safe to remove `producerStack.bucket` because as the bucket is being
deleted, `consumerStack` might still be using it.

Instead, the process takes two deployments:

**Deployment 1: break the relationship**:

- Make sure `consumerStack` no longer references `bucket.bucketName` (maybe the consumer
  stack now uses its own bucket, or it writes to an AWS DynamoDB table, or maybe you just
  remove the Lambda Function altogether).
- In the `ProducerStack` class, call `this.exportValue(this.bucket.bucketName)`. This
  will make sure the CloudFormation Export continues to exist while the relationship
  between the two stacks is being broken.
- Deploy (this will effectively only change the `consumerStack`, but it's safe to deploy both).

**Deployment 2: remove the bucket resource**:

- You are now free to remove the `bucket` resource from `producerStack`.
- Don't forget to remove the `exportValue()` call as well.
- Deploy again (this time only the `producerStack` will be changed -- the bucket will be deleted).

###### `exportedValue`<sup>Required</sup> <a name="exportedValue" id="raindancers-safemail.emailSecurity.MtaStsStack.exportValue.parameter.exportedValue"></a>

- *Type:* any

---

###### `options`<sup>Optional</sup> <a name="options" id="raindancers-safemail.emailSecurity.MtaStsStack.exportValue.parameter.options"></a>

- *Type:* aws-cdk-lib.ExportValueOptions

---

##### `formatArn` <a name="formatArn" id="raindancers-safemail.emailSecurity.MtaStsStack.formatArn"></a>

```typescript
public formatArn(components: ArnComponents): string
```

Creates an ARN from components.

If `partition`, `region` or `account` are not specified, the stack's
partition, region and account will be used.

If any component is the empty string, an empty string will be inserted
into the generated ARN at the location that component corresponds to.

The ARN will be formatted as follows:

  arn:{partition}:{service}:{region}:{account}:{resource}{sep}{resource-name}

The required ARN pieces that are omitted will be taken from the stack that
the 'scope' is attached to. If all ARN pieces are supplied, the supplied scope
can be 'undefined'.

###### `components`<sup>Required</sup> <a name="components" id="raindancers-safemail.emailSecurity.MtaStsStack.formatArn.parameter.components"></a>

- *Type:* aws-cdk-lib.ArnComponents

---

##### `getLogicalId` <a name="getLogicalId" id="raindancers-safemail.emailSecurity.MtaStsStack.getLogicalId"></a>

```typescript
public getLogicalId(element: CfnElement): string
```

Allocates a stack-unique CloudFormation-compatible logical identity for a specific resource.

This method is called when a `CfnElement` is created and used to render the
initial logical identity of resources. Logical ID renames are applied at
this stage.

This method uses the protected method `allocateLogicalId` to render the
logical ID for an element. To modify the naming scheme, extend the `Stack`
class and override this method.

###### `element`<sup>Required</sup> <a name="element" id="raindancers-safemail.emailSecurity.MtaStsStack.getLogicalId.parameter.element"></a>

- *Type:* aws-cdk-lib.CfnElement

The CloudFormation element for which a logical identity is needed.

---

##### `regionalFact` <a name="regionalFact" id="raindancers-safemail.emailSecurity.MtaStsStack.regionalFact"></a>

```typescript
public regionalFact(factName: string, defaultValue?: string): string
```

Look up a fact value for the given fact for the region of this stack.

Will return a definite value only if the region of the current stack is resolved.
If not, a lookup map will be added to the stack and the lookup will be done at
CDK deployment time.

What regions will be included in the lookup map is controlled by the
`@aws-cdk/core:target-partitions` context value: it must be set to a list
of partitions, and only regions from the given partitions will be included.
If no such context key is set, all regions will be included.

This function is intended to be used by construct library authors. Application
builders can rely on the abstractions offered by construct libraries and do
not have to worry about regional facts.

If `defaultValue` is not given, it is an error if the fact is unknown for
the given region.

###### `factName`<sup>Required</sup> <a name="factName" id="raindancers-safemail.emailSecurity.MtaStsStack.regionalFact.parameter.factName"></a>

- *Type:* string

---

###### `defaultValue`<sup>Optional</sup> <a name="defaultValue" id="raindancers-safemail.emailSecurity.MtaStsStack.regionalFact.parameter.defaultValue"></a>

- *Type:* string

---

##### `removeStackTag` <a name="removeStackTag" id="raindancers-safemail.emailSecurity.MtaStsStack.removeStackTag"></a>

```typescript
public removeStackTag(tagName: string): void
```

Remove a stack tag.

At deploy time, CloudFormation will automatically apply all stack tags to all resources in the stack.

###### `tagName`<sup>Required</sup> <a name="tagName" id="raindancers-safemail.emailSecurity.MtaStsStack.removeStackTag.parameter.tagName"></a>

- *Type:* string

---

##### `renameLogicalId` <a name="renameLogicalId" id="raindancers-safemail.emailSecurity.MtaStsStack.renameLogicalId"></a>

```typescript
public renameLogicalId(oldId: string, newId: string): void
```

Rename a generated logical identities.

To modify the naming scheme strategy, extend the `Stack` class and
override the `allocateLogicalId` method.

###### `oldId`<sup>Required</sup> <a name="oldId" id="raindancers-safemail.emailSecurity.MtaStsStack.renameLogicalId.parameter.oldId"></a>

- *Type:* string

---

###### `newId`<sup>Required</sup> <a name="newId" id="raindancers-safemail.emailSecurity.MtaStsStack.renameLogicalId.parameter.newId"></a>

- *Type:* string

---

##### `reportMissingContextKey` <a name="reportMissingContextKey" id="raindancers-safemail.emailSecurity.MtaStsStack.reportMissingContextKey"></a>

```typescript
public reportMissingContextKey(report: MissingContext): void
```

Indicate that a context key was expected.

Contains instructions which will be emitted into the cloud assembly on how
the key should be supplied.

###### `report`<sup>Required</sup> <a name="report" id="raindancers-safemail.emailSecurity.MtaStsStack.reportMissingContextKey.parameter.report"></a>

- *Type:* aws-cdk-lib.cloud_assembly_schema.MissingContext

The set of parameters needed to obtain the context.

---

##### `resolve` <a name="resolve" id="raindancers-safemail.emailSecurity.MtaStsStack.resolve"></a>

```typescript
public resolve(obj: any): any
```

Resolve a tokenized value in the context of the current stack.

###### `obj`<sup>Required</sup> <a name="obj" id="raindancers-safemail.emailSecurity.MtaStsStack.resolve.parameter.obj"></a>

- *Type:* any

---

##### `splitArn` <a name="splitArn" id="raindancers-safemail.emailSecurity.MtaStsStack.splitArn"></a>

```typescript
public splitArn(arn: string, arnFormat: ArnFormat): ArnComponents
```

Splits the provided ARN into its components.

Works both if 'arn' is a string like 'arn:aws:s3:::bucket',
and a Token representing a dynamic CloudFormation expression
(in which case the returned components will also be dynamic CloudFormation expressions,
encoded as Tokens).

###### `arn`<sup>Required</sup> <a name="arn" id="raindancers-safemail.emailSecurity.MtaStsStack.splitArn.parameter.arn"></a>

- *Type:* string

the ARN to split into its components.

---

###### `arnFormat`<sup>Required</sup> <a name="arnFormat" id="raindancers-safemail.emailSecurity.MtaStsStack.splitArn.parameter.arnFormat"></a>

- *Type:* aws-cdk-lib.ArnFormat

the expected format of 'arn' - depends on what format the service 'arn' represents uses.

---

##### `toJsonString` <a name="toJsonString" id="raindancers-safemail.emailSecurity.MtaStsStack.toJsonString"></a>

```typescript
public toJsonString(obj: any, space?: number): string
```

Convert an object, potentially containing tokens, to a JSON string.

###### `obj`<sup>Required</sup> <a name="obj" id="raindancers-safemail.emailSecurity.MtaStsStack.toJsonString.parameter.obj"></a>

- *Type:* any

---

###### `space`<sup>Optional</sup> <a name="space" id="raindancers-safemail.emailSecurity.MtaStsStack.toJsonString.parameter.space"></a>

- *Type:* number

---

##### `toYamlString` <a name="toYamlString" id="raindancers-safemail.emailSecurity.MtaStsStack.toYamlString"></a>

```typescript
public toYamlString(obj: any): string
```

Convert an object, potentially containing tokens, to a YAML string.

###### `obj`<sup>Required</sup> <a name="obj" id="raindancers-safemail.emailSecurity.MtaStsStack.toYamlString.parameter.obj"></a>

- *Type:* any

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.isStack">isStack</a></code> | Return whether the given object is a Stack. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.of">of</a></code> | Looks up the first stack scope in which `construct` is defined. |

---

##### `isConstruct` <a name="isConstruct" id="raindancers-safemail.emailSecurity.MtaStsStack.isConstruct"></a>

```typescript
import { emailSecurity } from 'raindancers-safemail'

emailSecurity.MtaStsStack.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="raindancers-safemail.emailSecurity.MtaStsStack.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isStack` <a name="isStack" id="raindancers-safemail.emailSecurity.MtaStsStack.isStack"></a>

```typescript
import { emailSecurity } from 'raindancers-safemail'

emailSecurity.MtaStsStack.isStack(x: any)
```

Return whether the given object is a Stack.

We do attribute detection since we can't reliably use 'instanceof'.

###### `x`<sup>Required</sup> <a name="x" id="raindancers-safemail.emailSecurity.MtaStsStack.isStack.parameter.x"></a>

- *Type:* any

---

##### `of` <a name="of" id="raindancers-safemail.emailSecurity.MtaStsStack.of"></a>

```typescript
import { emailSecurity } from 'raindancers-safemail'

emailSecurity.MtaStsStack.of(construct: IConstruct)
```

Looks up the first stack scope in which `construct` is defined.

Fails if there is no stack up the tree.

###### `construct`<sup>Required</sup> <a name="construct" id="raindancers-safemail.emailSecurity.MtaStsStack.of.parameter.construct"></a>

- *Type:* constructs.IConstruct

The construct to start the search from.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.property.account">account</a></code> | <code>string</code> | The AWS account into which this stack will be deployed. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.property.artifactId">artifactId</a></code> | <code>string</code> | The ID of the cloud assembly artifact for this stack. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.property.availabilityZones">availabilityZones</a></code> | <code>string[]</code> | Returns the list of AZs that are available in the AWS environment (account/region) associated with this stack. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.property.bundlingRequired">bundlingRequired</a></code> | <code>boolean</code> | Indicates whether the stack requires bundling or not. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.property.dependencies">dependencies</a></code> | <code>aws-cdk-lib.Stack[]</code> | Return the stacks this stack depends on. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.property.env">env</a></code> | <code>aws-cdk-lib.interfaces.ResourceEnvironment</code> | The environment this Stack deploys to. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.property.environment">environment</a></code> | <code>string</code> | The environment coordinates in which this stack is deployed. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.property.nested">nested</a></code> | <code>boolean</code> | Indicates if this is a nested stack, in which case `parentStack` will include a reference to it's parent. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.property.notificationArns">notificationArns</a></code> | <code>string[]</code> | Returns the list of notification Amazon Resource Names (ARNs) for the current stack. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.property.partition">partition</a></code> | <code>string</code> | The partition in which this stack is defined. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.property.region">region</a></code> | <code>string</code> | The AWS region into which this stack will be deployed (e.g. `us-west-2`). |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.property.stackId">stackId</a></code> | <code>string</code> | The ID of the stack. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.property.stackName">stackName</a></code> | <code>string</code> | The concrete CloudFormation physical stack name. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.property.synthesizer">synthesizer</a></code> | <code>aws-cdk-lib.IStackSynthesizer</code> | Synthesis method for this stack. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.property.tags">tags</a></code> | <code>aws-cdk-lib.TagManager</code> | Tags to be applied to the stack. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.property.templateFile">templateFile</a></code> | <code>string</code> | The name of the CloudFormation template file emitted to the output directory during synthesis. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.property.templateOptions">templateOptions</a></code> | <code>aws-cdk-lib.ITemplateOptions</code> | Options for CloudFormation template (like version, transform, description). |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.property.urlSuffix">urlSuffix</a></code> | <code>string</code> | The Amazon domain suffix for the region in which this stack is defined. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.property.nestedStackParent">nestedStackParent</a></code> | <code>aws-cdk-lib.Stack</code> | If this is a nested stack, returns it's parent stack. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.property.nestedStackResource">nestedStackResource</a></code> | <code>aws-cdk-lib.CfnResource</code> | If this is a nested stack, this represents its `AWS::CloudFormation::Stack` resource. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.property.terminationProtection">terminationProtection</a></code> | <code>boolean</code> | Whether termination protection is enabled for this stack. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.property.bucket">bucket</a></code> | <code>aws-cdk-lib.aws_s3.Bucket</code> | *No description.* |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.property.certificate">certificate</a></code> | <code>aws-cdk-lib.aws_certificatemanager.Certificate</code> | *No description.* |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStack.property.distribution">distribution</a></code> | <code>aws-cdk-lib.aws_cloudfront.Distribution</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="raindancers-safemail.emailSecurity.MtaStsStack.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `account`<sup>Required</sup> <a name="account" id="raindancers-safemail.emailSecurity.MtaStsStack.property.account"></a>

```typescript
public readonly account: string;
```

- *Type:* string

The AWS account into which this stack will be deployed.

This value is resolved according to the following rules:

1. The value provided to `env.account` when the stack is defined. This can
   either be a concrete account (e.g. `585695031111`) or the
   `Aws.ACCOUNT_ID` token.
3. `Aws.ACCOUNT_ID`, which represents the CloudFormation intrinsic reference
   `{ "Ref": "AWS::AccountId" }` encoded as a string token.

Preferably, you should use the return value as an opaque string and not
attempt to parse it to implement your logic. If you do, you must first
check that it is a concrete value an not an unresolved token. If this
value is an unresolved token (`Token.isUnresolved(stack.account)` returns
`true`), this implies that the user wishes that this stack will synthesize
into an **account-agnostic template**. In this case, your code should either
fail (throw an error, emit a synth error using `Annotations.of(construct).addError()`) or
implement some other account-agnostic behavior.

---

##### `artifactId`<sup>Required</sup> <a name="artifactId" id="raindancers-safemail.emailSecurity.MtaStsStack.property.artifactId"></a>

```typescript
public readonly artifactId: string;
```

- *Type:* string

The ID of the cloud assembly artifact for this stack.

---

##### `availabilityZones`<sup>Required</sup> <a name="availabilityZones" id="raindancers-safemail.emailSecurity.MtaStsStack.property.availabilityZones"></a>

```typescript
public readonly availabilityZones: string[];
```

- *Type:* string[]

Returns the list of AZs that are available in the AWS environment (account/region) associated with this stack.

If the stack is environment-agnostic (either account and/or region are
tokens), this property will return an array with 2 tokens that will resolve
at deploy-time to the first two availability zones returned from CloudFormation's
`Fn::GetAZs` intrinsic function.

If they are not available in the context, returns a set of dummy values and
reports them as missing, and let the CLI resolve them by calling EC2
`DescribeAvailabilityZones` on the target environment.

To specify a different strategy for selecting availability zones override this method.

---

##### `bundlingRequired`<sup>Required</sup> <a name="bundlingRequired" id="raindancers-safemail.emailSecurity.MtaStsStack.property.bundlingRequired"></a>

```typescript
public readonly bundlingRequired: boolean;
```

- *Type:* boolean

Indicates whether the stack requires bundling or not.

---

##### `dependencies`<sup>Required</sup> <a name="dependencies" id="raindancers-safemail.emailSecurity.MtaStsStack.property.dependencies"></a>

```typescript
public readonly dependencies: Stack[];
```

- *Type:* aws-cdk-lib.Stack[]

Return the stacks this stack depends on.

---

##### `env`<sup>Required</sup> <a name="env" id="raindancers-safemail.emailSecurity.MtaStsStack.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.interfaces.ResourceEnvironment

The environment this Stack deploys to.

---

##### `environment`<sup>Required</sup> <a name="environment" id="raindancers-safemail.emailSecurity.MtaStsStack.property.environment"></a>

```typescript
public readonly environment: string;
```

- *Type:* string

The environment coordinates in which this stack is deployed.

In the form
`aws://account/region`. Use `stack.account` and `stack.region` to obtain
the specific values, no need to parse.

You can use this value to determine if two stacks are targeting the same
environment.

If either `stack.account` or `stack.region` are not concrete values (e.g.
`Aws.ACCOUNT_ID` or `Aws.REGION`) the special strings `unknown-account` and/or
`unknown-region` will be used respectively to indicate this stack is
region/account-agnostic.

---

##### `nested`<sup>Required</sup> <a name="nested" id="raindancers-safemail.emailSecurity.MtaStsStack.property.nested"></a>

```typescript
public readonly nested: boolean;
```

- *Type:* boolean

Indicates if this is a nested stack, in which case `parentStack` will include a reference to it's parent.

---

##### `notificationArns`<sup>Required</sup> <a name="notificationArns" id="raindancers-safemail.emailSecurity.MtaStsStack.property.notificationArns"></a>

```typescript
public readonly notificationArns: string[];
```

- *Type:* string[]

Returns the list of notification Amazon Resource Names (ARNs) for the current stack.

---

##### `partition`<sup>Required</sup> <a name="partition" id="raindancers-safemail.emailSecurity.MtaStsStack.property.partition"></a>

```typescript
public readonly partition: string;
```

- *Type:* string

The partition in which this stack is defined.

---

##### `region`<sup>Required</sup> <a name="region" id="raindancers-safemail.emailSecurity.MtaStsStack.property.region"></a>

```typescript
public readonly region: string;
```

- *Type:* string

The AWS region into which this stack will be deployed (e.g. `us-west-2`).

This value is resolved according to the following rules:

1. The value provided to `env.region` when the stack is defined. This can
   either be a concrete region (e.g. `us-west-2`) or the `Aws.REGION`
   token.
3. `Aws.REGION`, which is represents the CloudFormation intrinsic reference
   `{ "Ref": "AWS::Region" }` encoded as a string token.

Preferably, you should use the return value as an opaque string and not
attempt to parse it to implement your logic. If you do, you must first
check that it is a concrete value an not an unresolved token. If this
value is an unresolved token (`Token.isUnresolved(stack.region)` returns
`true`), this implies that the user wishes that this stack will synthesize
into a **region-agnostic template**. In this case, your code should either
fail (throw an error, emit a synth error using `Annotations.of(construct).addError()`) or
implement some other region-agnostic behavior.

---

##### `stackId`<sup>Required</sup> <a name="stackId" id="raindancers-safemail.emailSecurity.MtaStsStack.property.stackId"></a>

```typescript
public readonly stackId: string;
```

- *Type:* string

The ID of the stack.

---

*Example*

```typescript
// After resolving, looks like
'arn:aws:cloudformation:us-west-2:123456789012:stack/teststack/51af3dc0-da77-11e4-872e-1234567db123'
```


##### `stackName`<sup>Required</sup> <a name="stackName" id="raindancers-safemail.emailSecurity.MtaStsStack.property.stackName"></a>

```typescript
public readonly stackName: string;
```

- *Type:* string

The concrete CloudFormation physical stack name.

This is either the name defined explicitly in the `stackName` prop or
allocated based on the stack's location in the construct tree. Stacks that
are directly defined under the app use their construct `id` as their stack
name. Stacks that are defined deeper within the tree will use a hashed naming
scheme based on the construct path to ensure uniqueness.

If you wish to obtain the deploy-time AWS::StackName intrinsic,
you can use `Aws.STACK_NAME` directly.

---

##### `synthesizer`<sup>Required</sup> <a name="synthesizer" id="raindancers-safemail.emailSecurity.MtaStsStack.property.synthesizer"></a>

```typescript
public readonly synthesizer: IStackSynthesizer;
```

- *Type:* aws-cdk-lib.IStackSynthesizer

Synthesis method for this stack.

---

##### `tags`<sup>Required</sup> <a name="tags" id="raindancers-safemail.emailSecurity.MtaStsStack.property.tags"></a>

```typescript
public readonly tags: TagManager;
```

- *Type:* aws-cdk-lib.TagManager

Tags to be applied to the stack.

---

##### `templateFile`<sup>Required</sup> <a name="templateFile" id="raindancers-safemail.emailSecurity.MtaStsStack.property.templateFile"></a>

```typescript
public readonly templateFile: string;
```

- *Type:* string

The name of the CloudFormation template file emitted to the output directory during synthesis.

Example value: `MyStack.template.json`

---

##### `templateOptions`<sup>Required</sup> <a name="templateOptions" id="raindancers-safemail.emailSecurity.MtaStsStack.property.templateOptions"></a>

```typescript
public readonly templateOptions: ITemplateOptions;
```

- *Type:* aws-cdk-lib.ITemplateOptions

Options for CloudFormation template (like version, transform, description).

---

##### `urlSuffix`<sup>Required</sup> <a name="urlSuffix" id="raindancers-safemail.emailSecurity.MtaStsStack.property.urlSuffix"></a>

```typescript
public readonly urlSuffix: string;
```

- *Type:* string

The Amazon domain suffix for the region in which this stack is defined.

---

##### `nestedStackParent`<sup>Optional</sup> <a name="nestedStackParent" id="raindancers-safemail.emailSecurity.MtaStsStack.property.nestedStackParent"></a>

```typescript
public readonly nestedStackParent: Stack;
```

- *Type:* aws-cdk-lib.Stack

If this is a nested stack, returns it's parent stack.

---

##### `nestedStackResource`<sup>Optional</sup> <a name="nestedStackResource" id="raindancers-safemail.emailSecurity.MtaStsStack.property.nestedStackResource"></a>

```typescript
public readonly nestedStackResource: CfnResource;
```

- *Type:* aws-cdk-lib.CfnResource

If this is a nested stack, this represents its `AWS::CloudFormation::Stack` resource.

`undefined` for top-level (non-nested) stacks.

---

##### `terminationProtection`<sup>Required</sup> <a name="terminationProtection" id="raindancers-safemail.emailSecurity.MtaStsStack.property.terminationProtection"></a>

```typescript
public readonly terminationProtection: boolean;
```

- *Type:* boolean

Whether termination protection is enabled for this stack.

---

##### `bucket`<sup>Required</sup> <a name="bucket" id="raindancers-safemail.emailSecurity.MtaStsStack.property.bucket"></a>

```typescript
public readonly bucket: Bucket;
```

- *Type:* aws-cdk-lib.aws_s3.Bucket

---

##### `certificate`<sup>Required</sup> <a name="certificate" id="raindancers-safemail.emailSecurity.MtaStsStack.property.certificate"></a>

```typescript
public readonly certificate: Certificate;
```

- *Type:* aws-cdk-lib.aws_certificatemanager.Certificate

---

##### `distribution`<sup>Required</sup> <a name="distribution" id="raindancers-safemail.emailSecurity.MtaStsStack.property.distribution"></a>

```typescript
public readonly distribution: Distribution;
```

- *Type:* aws-cdk-lib.aws_cloudfront.Distribution

---


## Structs <a name="Structs" id="Structs"></a>

### AbuseIpDbConfig <a name="AbuseIpDbConfig" id="raindancers-safemail.emailSecurity.AbuseIpDbConfig"></a>

AbuseIPDB IP enrichment configuration.

#### Initializer <a name="Initializer" id="raindancers-safemail.emailSecurity.AbuseIpDbConfig.Initializer"></a>

```typescript
import { emailSecurity } from 'raindancers-safemail'

const abuseIpDbConfig: emailSecurity.AbuseIpDbConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#raindancers-safemail.emailSecurity.AbuseIpDbConfig.property.secretArn">secretArn</a></code> | <code>string</code> | Secrets Manager ARN containing `{ "abuseIpDb": "<api-key>" }`. |
| <code><a href="#raindancers-safemail.emailSecurity.AbuseIpDbConfig.property.reportAbuse">reportAbuse</a></code> | <code>raindancers-safemail.emailSecurity.AbuseReportCondition</code> | Whether to report abusive IPs back to AbuseIPDB. |

---

##### `secretArn`<sup>Required</sup> <a name="secretArn" id="raindancers-safemail.emailSecurity.AbuseIpDbConfig.property.secretArn"></a>

```typescript
public readonly secretArn: string;
```

- *Type:* string

Secrets Manager ARN containing `{ "abuseIpDb": "<api-key>" }`.

---

##### `reportAbuse`<sup>Optional</sup> <a name="reportAbuse" id="raindancers-safemail.emailSecurity.AbuseIpDbConfig.property.reportAbuse"></a>

```typescript
public readonly reportAbuse: AbuseReportCondition;
```

- *Type:* raindancers-safemail.emailSecurity.AbuseReportCondition

Whether to report abusive IPs back to AbuseIPDB.

Defaults to NEVER.

---

### AddAlertsConfig <a name="AddAlertsConfig" id="raindancers-safemail.emailSecurity.AddAlertsConfig"></a>

Configuration for {@link EmailSecurity.addAlerts}.

#### Initializer <a name="Initializer" id="raindancers-safemail.emailSecurity.AddAlertsConfig.Initializer"></a>

```typescript
import { emailSecurity } from 'raindancers-safemail'

const addAlertsConfig: emailSecurity.AddAlertsConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#raindancers-safemail.emailSecurity.AddAlertsConfig.property.alertEmail">alertEmail</a></code> | <code>string</code> | *No description.* |
| <code><a href="#raindancers-safemail.emailSecurity.AddAlertsConfig.property.reportDomain">reportDomain</a></code> | <code>string</code> | *No description.* |
| <code><a href="#raindancers-safemail.emailSecurity.AddAlertsConfig.property.abuseIpDb">abuseIpDb</a></code> | <code>raindancers-safemail.emailSecurity.AbuseIpDbConfig</code> | *No description.* |
| <code><a href="#raindancers-safemail.emailSecurity.AddAlertsConfig.property.aiEnrichment">aiEnrichment</a></code> | <code>raindancers-safemail.emailSecurity.AiEnrichmentConfig</code> | *No description.* |
| <code><a href="#raindancers-safemail.emailSecurity.AddAlertsConfig.property.dmarcEmail">dmarcEmail</a></code> | <code>string</code> | *No description.* |
| <code><a href="#raindancers-safemail.emailSecurity.AddAlertsConfig.property.sesRegion">sesRegion</a></code> | <code>string</code> | *No description.* |
| <code><a href="#raindancers-safemail.emailSecurity.AddAlertsConfig.property.tlsRptEmail">tlsRptEmail</a></code> | <code>string</code> | *No description.* |

---

##### `alertEmail`<sup>Required</sup> <a name="alertEmail" id="raindancers-safemail.emailSecurity.AddAlertsConfig.property.alertEmail"></a>

```typescript
public readonly alertEmail: string;
```

- *Type:* string

---

##### `reportDomain`<sup>Required</sup> <a name="reportDomain" id="raindancers-safemail.emailSecurity.AddAlertsConfig.property.reportDomain"></a>

```typescript
public readonly reportDomain: string;
```

- *Type:* string

---

##### `abuseIpDb`<sup>Optional</sup> <a name="abuseIpDb" id="raindancers-safemail.emailSecurity.AddAlertsConfig.property.abuseIpDb"></a>

```typescript
public readonly abuseIpDb: AbuseIpDbConfig;
```

- *Type:* raindancers-safemail.emailSecurity.AbuseIpDbConfig

---

##### `aiEnrichment`<sup>Optional</sup> <a name="aiEnrichment" id="raindancers-safemail.emailSecurity.AddAlertsConfig.property.aiEnrichment"></a>

```typescript
public readonly aiEnrichment: AiEnrichmentConfig;
```

- *Type:* raindancers-safemail.emailSecurity.AiEnrichmentConfig

---

##### `dmarcEmail`<sup>Optional</sup> <a name="dmarcEmail" id="raindancers-safemail.emailSecurity.AddAlertsConfig.property.dmarcEmail"></a>

```typescript
public readonly dmarcEmail: string;
```

- *Type:* string

---

##### `sesRegion`<sup>Optional</sup> <a name="sesRegion" id="raindancers-safemail.emailSecurity.AddAlertsConfig.property.sesRegion"></a>

```typescript
public readonly sesRegion: string;
```

- *Type:* string

---

##### `tlsRptEmail`<sup>Optional</sup> <a name="tlsRptEmail" id="raindancers-safemail.emailSecurity.AddAlertsConfig.property.tlsRptEmail"></a>

```typescript
public readonly tlsRptEmail: string;
```

- *Type:* string

---

### AddMtaStsConfig <a name="AddMtaStsConfig" id="raindancers-safemail.emailSecurity.AddMtaStsConfig"></a>

Configuration for {@link EmailSecurity.addMtaSts}.

#### Initializer <a name="Initializer" id="raindancers-safemail.emailSecurity.AddMtaStsConfig.Initializer"></a>

```typescript
import { emailSecurity } from 'raindancers-safemail'

const addMtaStsConfig: emailSecurity.AddMtaStsConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#raindancers-safemail.emailSecurity.AddMtaStsConfig.property.mode">mode</a></code> | <code>raindancers-safemail.emailSecurity.MtaStsMode</code> | *No description.* |
| <code><a href="#raindancers-safemail.emailSecurity.AddMtaStsConfig.property.maxAge">maxAge</a></code> | <code>number</code> | *No description.* |
| <code><a href="#raindancers-safemail.emailSecurity.AddMtaStsConfig.property.mxPatterns">mxPatterns</a></code> | <code>string[]</code> | *No description.* |

---

##### `mode`<sup>Required</sup> <a name="mode" id="raindancers-safemail.emailSecurity.AddMtaStsConfig.property.mode"></a>

```typescript
public readonly mode: MtaStsMode;
```

- *Type:* raindancers-safemail.emailSecurity.MtaStsMode

---

##### `maxAge`<sup>Optional</sup> <a name="maxAge" id="raindancers-safemail.emailSecurity.AddMtaStsConfig.property.maxAge"></a>

```typescript
public readonly maxAge: number;
```

- *Type:* number

---

##### `mxPatterns`<sup>Optional</sup> <a name="mxPatterns" id="raindancers-safemail.emailSecurity.AddMtaStsConfig.property.mxPatterns"></a>

```typescript
public readonly mxPatterns: string[];
```

- *Type:* string[]

---

### AiEnrichmentConfig <a name="AiEnrichmentConfig" id="raindancers-safemail.emailSecurity.AiEnrichmentConfig"></a>

AI enrichment configuration via Amazon Bedrock.

#### Initializer <a name="Initializer" id="raindancers-safemail.emailSecurity.AiEnrichmentConfig.Initializer"></a>

```typescript
import { emailSecurity } from 'raindancers-safemail'

const aiEnrichmentConfig: emailSecurity.AiEnrichmentConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#raindancers-safemail.emailSecurity.AiEnrichmentConfig.property.modelId">modelId</a></code> | <code>string</code> | Use a {@link BedrockModelId} enum value for known models, or a raw string for custom/future models. |

---

##### `modelId`<sup>Required</sup> <a name="modelId" id="raindancers-safemail.emailSecurity.AiEnrichmentConfig.property.modelId"></a>

```typescript
public readonly modelId: string;
```

- *Type:* string

Use a {@link BedrockModelId} enum value for known models, or a raw string for custom/future models.

---

### DkimCnameSelector <a name="DkimCnameSelector" id="raindancers-safemail.emailSecurity.DkimCnameSelector"></a>

A DKIM selector published as a CNAME record, used by providers that manage keys on your behalf.

#### Initializer <a name="Initializer" id="raindancers-safemail.emailSecurity.DkimCnameSelector.Initializer"></a>

```typescript
import { emailSecurity } from 'raindancers-safemail'

const dkimCnameSelector: emailSecurity.DkimCnameSelector = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#raindancers-safemail.emailSecurity.DkimCnameSelector.property.name">name</a></code> | <code>string</code> | Selector name, e.g. `'selector1'`. |
| <code><a href="#raindancers-safemail.emailSecurity.DkimCnameSelector.property.target">target</a></code> | <code>string</code> | The CNAME target the provider instructs you to point to. |

---

##### `name`<sup>Required</sup> <a name="name" id="raindancers-safemail.emailSecurity.DkimCnameSelector.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

Selector name, e.g. `'selector1'`.

---

##### `target`<sup>Required</sup> <a name="target" id="raindancers-safemail.emailSecurity.DkimCnameSelector.property.target"></a>

```typescript
public readonly target: string;
```

- *Type:* string

The CNAME target the provider instructs you to point to.

---

### DkimSelector <a name="DkimSelector" id="raindancers-safemail.emailSecurity.DkimSelector"></a>

A DKIM selector published as a TXT record (`<name>._domainkey.<domain>`).

#### Initializer <a name="Initializer" id="raindancers-safemail.emailSecurity.DkimSelector.Initializer"></a>

```typescript
import { emailSecurity } from 'raindancers-safemail'

const dkimSelector: emailSecurity.DkimSelector = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#raindancers-safemail.emailSecurity.DkimSelector.property.name">name</a></code> | <code>string</code> | Selector name, e.g. `'default'` or `'google'`. |
| <code><a href="#raindancers-safemail.emailSecurity.DkimSelector.property.publicKey">publicKey</a></code> | <code>string</code> | Full public key value, e.g. `'p=MIGfMA0GCSqGSIb3...'`. |

---

##### `name`<sup>Required</sup> <a name="name" id="raindancers-safemail.emailSecurity.DkimSelector.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

Selector name, e.g. `'default'` or `'google'`.

---

##### `publicKey`<sup>Required</sup> <a name="publicKey" id="raindancers-safemail.emailSecurity.DkimSelector.property.publicKey"></a>

```typescript
public readonly publicKey: string;
```

- *Type:* string

Full public key value, e.g. `'p=MIGfMA0GCSqGSIb3...'`.

---

### DmarcConfig <a name="DmarcConfig" id="raindancers-safemail.emailSecurity.DmarcConfig"></a>

Configuration for the DMARC TXT record published at `_dmarc.<domain>`.

*Example*

```typescript
emailSec.addDmarc({
  policy: DmarcPolicy.REJECT,
  percentage: 100,
  adkim: 's',
  aspf: 's',
});
```


#### Initializer <a name="Initializer" id="raindancers-safemail.emailSecurity.DmarcConfig.Initializer"></a>

```typescript
import { emailSecurity } from 'raindancers-safemail'

const dmarcConfig: emailSecurity.DmarcConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#raindancers-safemail.emailSecurity.DmarcConfig.property.policy">policy</a></code> | <code>raindancers-safemail.emailSecurity.DmarcPolicy</code> | Policy applied to mail that fails DMARC alignment. |
| <code><a href="#raindancers-safemail.emailSecurity.DmarcConfig.property.adkim">adkim</a></code> | <code>string</code> | DKIM alignment mode: `'r'` = relaxed (default), `'s'` = strict (exact domain match required). |
| <code><a href="#raindancers-safemail.emailSecurity.DmarcConfig.property.aspf">aspf</a></code> | <code>string</code> | SPF alignment mode: `'r'` = relaxed (default), `'s'` = strict (exact domain match required). |
| <code><a href="#raindancers-safemail.emailSecurity.DmarcConfig.property.percentage">percentage</a></code> | <code>number</code> | Percentage of failing messages to apply the policy to (1–100). |
| <code><a href="#raindancers-safemail.emailSecurity.DmarcConfig.property.rua">rua</a></code> | <code>string[]</code> | Aggregate report recipients (`rua`). |
| <code><a href="#raindancers-safemail.emailSecurity.DmarcConfig.property.ruf">ruf</a></code> | <code>string[]</code> | Forensic/failure report recipients (`ruf`). |
| <code><a href="#raindancers-safemail.emailSecurity.DmarcConfig.property.subdomainPolicy">subdomainPolicy</a></code> | <code>raindancers-safemail.emailSecurity.DmarcPolicy</code> | Override policy for subdomains. |

---

##### `policy`<sup>Required</sup> <a name="policy" id="raindancers-safemail.emailSecurity.DmarcConfig.property.policy"></a>

```typescript
public readonly policy: DmarcPolicy;
```

- *Type:* raindancers-safemail.emailSecurity.DmarcPolicy

Policy applied to mail that fails DMARC alignment.

---

##### `adkim`<sup>Optional</sup> <a name="adkim" id="raindancers-safemail.emailSecurity.DmarcConfig.property.adkim"></a>

```typescript
public readonly adkim: string;
```

- *Type:* string

DKIM alignment mode: `'r'` = relaxed (default), `'s'` = strict (exact domain match required).

---

##### `aspf`<sup>Optional</sup> <a name="aspf" id="raindancers-safemail.emailSecurity.DmarcConfig.property.aspf"></a>

```typescript
public readonly aspf: string;
```

- *Type:* string

SPF alignment mode: `'r'` = relaxed (default), `'s'` = strict (exact domain match required).

---

##### `percentage`<sup>Optional</sup> <a name="percentage" id="raindancers-safemail.emailSecurity.DmarcConfig.property.percentage"></a>

```typescript
public readonly percentage: number;
```

- *Type:* number

Percentage of failing messages to apply the policy to (1–100).

Useful for gradual rollout.

---

##### `rua`<sup>Optional</sup> <a name="rua" id="raindancers-safemail.emailSecurity.DmarcConfig.property.rua"></a>

```typescript
public readonly rua: string[];
```

- *Type:* string[]

Aggregate report recipients (`rua`).

Each entry must be a `mailto:` URI.
Omit when using `addAlerts()` — it sets this automatically.

---

##### `ruf`<sup>Optional</sup> <a name="ruf" id="raindancers-safemail.emailSecurity.DmarcConfig.property.ruf"></a>

```typescript
public readonly ruf: string[];
```

- *Type:* string[]

Forensic/failure report recipients (`ruf`).

Each entry must be a `mailto:` URI.
Note: many providers no longer send forensic reports.

---

##### `subdomainPolicy`<sup>Optional</sup> <a name="subdomainPolicy" id="raindancers-safemail.emailSecurity.DmarcConfig.property.subdomainPolicy"></a>

```typescript
public readonly subdomainPolicy: DmarcPolicy;
```

- *Type:* raindancers-safemail.emailSecurity.DmarcPolicy

Override policy for subdomains.

Defaults to the root `policy` if omitted.

---

### EmailReportingProps <a name="EmailReportingProps" id="raindancers-safemail.emailSecurity.EmailReportingProps"></a>

#### Initializer <a name="Initializer" id="raindancers-safemail.emailSecurity.EmailReportingProps.Initializer"></a>

```typescript
import { emailSecurity } from 'raindancers-safemail'

const emailReportingProps: emailSecurity.EmailReportingProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#raindancers-safemail.emailSecurity.EmailReportingProps.property.alertEmail">alertEmail</a></code> | <code>string</code> | *No description.* |
| <code><a href="#raindancers-safemail.emailSecurity.EmailReportingProps.property.hostedZone">hostedZone</a></code> | <code>aws-cdk-lib.aws_route53.IHostedZone</code> | *No description.* |
| <code><a href="#raindancers-safemail.emailSecurity.EmailReportingProps.property.reportDomain">reportDomain</a></code> | <code>string</code> | *No description.* |
| <code><a href="#raindancers-safemail.emailSecurity.EmailReportingProps.property.abuseIpDb">abuseIpDb</a></code> | <code>raindancers-safemail.emailSecurity.AbuseIpDbConfig</code> | Enable IP enrichment via AbuseIPDB. |
| <code><a href="#raindancers-safemail.emailSecurity.EmailReportingProps.property.aiEnrichment">aiEnrichment</a></code> | <code>raindancers-safemail.emailSecurity.AiEnrichmentConfig</code> | Enable AI-generated narrative enrichment via Amazon Bedrock. |
| <code><a href="#raindancers-safemail.emailSecurity.EmailReportingProps.property.sesRegion">sesRegion</a></code> | <code>string</code> | *No description.* |

---

##### `alertEmail`<sup>Required</sup> <a name="alertEmail" id="raindancers-safemail.emailSecurity.EmailReportingProps.property.alertEmail"></a>

```typescript
public readonly alertEmail: string;
```

- *Type:* string

---

##### `hostedZone`<sup>Required</sup> <a name="hostedZone" id="raindancers-safemail.emailSecurity.EmailReportingProps.property.hostedZone"></a>

```typescript
public readonly hostedZone: IHostedZone;
```

- *Type:* aws-cdk-lib.aws_route53.IHostedZone

---

##### `reportDomain`<sup>Required</sup> <a name="reportDomain" id="raindancers-safemail.emailSecurity.EmailReportingProps.property.reportDomain"></a>

```typescript
public readonly reportDomain: string;
```

- *Type:* string

---

##### `abuseIpDb`<sup>Optional</sup> <a name="abuseIpDb" id="raindancers-safemail.emailSecurity.EmailReportingProps.property.abuseIpDb"></a>

```typescript
public readonly abuseIpDb: AbuseIpDbConfig;
```

- *Type:* raindancers-safemail.emailSecurity.AbuseIpDbConfig

Enable IP enrichment via AbuseIPDB.

---

##### `aiEnrichment`<sup>Optional</sup> <a name="aiEnrichment" id="raindancers-safemail.emailSecurity.EmailReportingProps.property.aiEnrichment"></a>

```typescript
public readonly aiEnrichment: AiEnrichmentConfig;
```

- *Type:* raindancers-safemail.emailSecurity.AiEnrichmentConfig

Enable AI-generated narrative enrichment via Amazon Bedrock.

---

##### `sesRegion`<sup>Optional</sup> <a name="sesRegion" id="raindancers-safemail.emailSecurity.EmailReportingProps.property.sesRegion"></a>

```typescript
public readonly sesRegion: string;
```

- *Type:* string

---

### EmailSecurityProps <a name="EmailSecurityProps" id="raindancers-safemail.emailSecurity.EmailSecurityProps"></a>

Props for the {@link EmailSecurity} construct.

#### Initializer <a name="Initializer" id="raindancers-safemail.emailSecurity.EmailSecurityProps.Initializer"></a>

```typescript
import { emailSecurity } from 'raindancers-safemail'

const emailSecurityProps: emailSecurity.EmailSecurityProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#raindancers-safemail.emailSecurity.EmailSecurityProps.property.hostedZone">hostedZone</a></code> | <code>aws-cdk-lib.aws_route53.IHostedZone</code> | The Route53 hosted zone for the domain being secured. |

---

##### `hostedZone`<sup>Required</sup> <a name="hostedZone" id="raindancers-safemail.emailSecurity.EmailSecurityProps.property.hostedZone"></a>

```typescript
public readonly hostedZone: IHostedZone;
```

- *Type:* aws-cdk-lib.aws_route53.IHostedZone

The Route53 hosted zone for the domain being secured.

---

### MtaStsStackProps <a name="MtaStsStackProps" id="raindancers-safemail.emailSecurity.MtaStsStackProps"></a>

#### Initializer <a name="Initializer" id="raindancers-safemail.emailSecurity.MtaStsStackProps.Initializer"></a>

```typescript
import { emailSecurity } from 'raindancers-safemail'

const mtaStsStackProps: emailSecurity.MtaStsStackProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStackProps.property.analyticsReporting">analyticsReporting</a></code> | <code>boolean</code> | Include runtime versioning information in this Stack. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStackProps.property.crossRegionReferences">crossRegionReferences</a></code> | <code>boolean</code> | Enable this flag to allow native cross region stack references. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStackProps.property.description">description</a></code> | <code>string</code> | A description of the stack. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStackProps.property.env">env</a></code> | <code>aws-cdk-lib.Environment</code> | The AWS environment (account/region) where this stack will be deployed. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStackProps.property.notificationArns">notificationArns</a></code> | <code>string[]</code> | SNS Topic ARNs that will receive stack events. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStackProps.property.permissionsBoundary">permissionsBoundary</a></code> | <code>aws-cdk-lib.PermissionsBoundary</code> | Options for applying a permissions boundary to all IAM Roles and Users created within this Stage. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStackProps.property.propertyInjectors">propertyInjectors</a></code> | <code>aws-cdk-lib.IPropertyInjector[]</code> | A list of IPropertyInjector attached to this Stack. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStackProps.property.stackName">stackName</a></code> | <code>string</code> | Name to deploy the stack with. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStackProps.property.suppressTemplateIndentation">suppressTemplateIndentation</a></code> | <code>boolean</code> | Enable this flag to suppress indentation in generated CloudFormation templates. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStackProps.property.synthesizer">synthesizer</a></code> | <code>aws-cdk-lib.IStackSynthesizer</code> | Synthesis method to use while deploying this stack. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStackProps.property.tags">tags</a></code> | <code>{[ key: string ]: string}</code> | Tags that will be applied to the Stack. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStackProps.property.terminationProtection">terminationProtection</a></code> | <code>boolean</code> | Whether to enable termination protection for this stack. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStackProps.property.domain">domain</a></code> | <code>string</code> | *No description.* |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStackProps.property.hostedZone">hostedZone</a></code> | <code>aws-cdk-lib.aws_route53.IHostedZone</code> | *No description.* |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStackProps.property.mode">mode</a></code> | <code>raindancers-safemail.emailSecurity.MtaStsMode</code> | *No description.* |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStackProps.property.maxAge">maxAge</a></code> | <code>number</code> | *No description.* |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsStackProps.property.mxPatterns">mxPatterns</a></code> | <code>string[]</code> | *No description.* |

---

##### `analyticsReporting`<sup>Optional</sup> <a name="analyticsReporting" id="raindancers-safemail.emailSecurity.MtaStsStackProps.property.analyticsReporting"></a>

```typescript
public readonly analyticsReporting: boolean;
```

- *Type:* boolean
- *Default:* `analyticsReporting` setting of containing `App`, or value of 'aws:cdk:version-reporting' context key

Include runtime versioning information in this Stack.

---

##### `crossRegionReferences`<sup>Optional</sup> <a name="crossRegionReferences" id="raindancers-safemail.emailSecurity.MtaStsStackProps.property.crossRegionReferences"></a>

```typescript
public readonly crossRegionReferences: boolean;
```

- *Type:* boolean
- *Default:* false

Enable this flag to allow native cross region stack references.

Enabling this will create a CloudFormation custom resource
in both the producing stack and consuming stack in order to perform the export/import

This feature is currently experimental

---

##### `description`<sup>Optional</sup> <a name="description" id="raindancers-safemail.emailSecurity.MtaStsStackProps.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string
- *Default:* No description.

A description of the stack.

---

##### `env`<sup>Optional</sup> <a name="env" id="raindancers-safemail.emailSecurity.MtaStsStackProps.property.env"></a>

```typescript
public readonly env: Environment;
```

- *Type:* aws-cdk-lib.Environment
- *Default:* The environment of the containing `Stage` if available, otherwise create the stack will be environment-agnostic.

The AWS environment (account/region) where this stack will be deployed.

Set the `region`/`account` fields of `env` to either a concrete value to
select the indicated environment (recommended for production stacks), or to
the values of environment variables
`CDK_DEFAULT_REGION`/`CDK_DEFAULT_ACCOUNT` to let the target environment
depend on the AWS credentials/configuration that the CDK CLI is executed
under (recommended for development stacks).

If the `Stack` is instantiated inside a `Stage`, any undefined
`region`/`account` fields from `env` will default to the same field on the
encompassing `Stage`, if configured there.

If either `region` or `account` are not set nor inherited from `Stage`, the
Stack will be considered "*environment-agnostic*"". Environment-agnostic
stacks can be deployed to any environment but may not be able to take
advantage of all features of the CDK. For example, they will not be able to
use environmental context lookups such as `ec2.Vpc.fromLookup` and will not
automatically translate Service Principals to the right format based on the
environment's AWS partition, and other such enhancements.

---

*Example*

```typescript
// Use a concrete account and region to deploy this stack to:
// `.account` and `.region` will simply return these values.
new Stack(app, 'Stack1', {
  env: {
    account: '123456789012',
    region: 'us-east-1'
  },
});

// Use the CLI's current credentials to determine the target environment:
// `.account` and `.region` will reflect the account+region the CLI
// is configured to use (based on the user CLI credentials)
new Stack(app, 'Stack2', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  },
});

// Define multiple stacks stage associated with an environment
const myStage = new Stage(app, 'MyStage', {
  env: {
    account: '123456789012',
    region: 'us-east-1'
  }
});

// both of these stacks will use the stage's account/region:
// `.account` and `.region` will resolve to the concrete values as above
new MyStack(myStage, 'Stack1');
new YourStack(myStage, 'Stack2');

// Define an environment-agnostic stack:
// `.account` and `.region` will resolve to `{ "Ref": "AWS::AccountId" }` and `{ "Ref": "AWS::Region" }` respectively.
// which will only resolve to actual values by CloudFormation during deployment.
new MyStack(app, 'Stack1');
```


##### `notificationArns`<sup>Optional</sup> <a name="notificationArns" id="raindancers-safemail.emailSecurity.MtaStsStackProps.property.notificationArns"></a>

```typescript
public readonly notificationArns: string[];
```

- *Type:* string[]
- *Default:* no notification arns.

SNS Topic ARNs that will receive stack events.

---

##### `permissionsBoundary`<sup>Optional</sup> <a name="permissionsBoundary" id="raindancers-safemail.emailSecurity.MtaStsStackProps.property.permissionsBoundary"></a>

```typescript
public readonly permissionsBoundary: PermissionsBoundary;
```

- *Type:* aws-cdk-lib.PermissionsBoundary
- *Default:* no permissions boundary is applied

Options for applying a permissions boundary to all IAM Roles and Users created within this Stage.

---

##### `propertyInjectors`<sup>Optional</sup> <a name="propertyInjectors" id="raindancers-safemail.emailSecurity.MtaStsStackProps.property.propertyInjectors"></a>

```typescript
public readonly propertyInjectors: IPropertyInjector[];
```

- *Type:* aws-cdk-lib.IPropertyInjector[]
- *Default:* no PropertyInjectors

A list of IPropertyInjector attached to this Stack.

---

##### `stackName`<sup>Optional</sup> <a name="stackName" id="raindancers-safemail.emailSecurity.MtaStsStackProps.property.stackName"></a>

```typescript
public readonly stackName: string;
```

- *Type:* string
- *Default:* Derived from construct path.

Name to deploy the stack with.

---

##### `suppressTemplateIndentation`<sup>Optional</sup> <a name="suppressTemplateIndentation" id="raindancers-safemail.emailSecurity.MtaStsStackProps.property.suppressTemplateIndentation"></a>

```typescript
public readonly suppressTemplateIndentation: boolean;
```

- *Type:* boolean
- *Default:* the value of `@aws-cdk/core:suppressTemplateIndentation`, or `false` if that is not set.

Enable this flag to suppress indentation in generated CloudFormation templates.

If not specified, the value of the `@aws-cdk/core:suppressTemplateIndentation`
context key will be used. If that is not specified, then the
default value `false` will be used.

---

##### `synthesizer`<sup>Optional</sup> <a name="synthesizer" id="raindancers-safemail.emailSecurity.MtaStsStackProps.property.synthesizer"></a>

```typescript
public readonly synthesizer: IStackSynthesizer;
```

- *Type:* aws-cdk-lib.IStackSynthesizer
- *Default:* The synthesizer specified on `App`, or `DefaultStackSynthesizer` otherwise.

Synthesis method to use while deploying this stack.

The Stack Synthesizer controls aspects of synthesis and deployment,
like how assets are referenced and what IAM roles to use. For more
information, see the README of the main CDK package.

If not specified, the `defaultStackSynthesizer` from `App` will be used.
If that is not specified, `DefaultStackSynthesizer` is used if
`@aws-cdk/core:newStyleStackSynthesis` is set to `true` or the CDK major
version is v2. In CDK v1 `LegacyStackSynthesizer` is the default if no
other synthesizer is specified.

---

##### `tags`<sup>Optional</sup> <a name="tags" id="raindancers-safemail.emailSecurity.MtaStsStackProps.property.tags"></a>

```typescript
public readonly tags: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}
- *Default:* {}

Tags that will be applied to the Stack.

These tags are applied to the CloudFormation Stack itself. They will not
appear in the CloudFormation template.

However, at deployment time, CloudFormation will apply these tags to all
resources in the stack that support tagging. You will not be able to exempt
resources from tagging (using the `excludeResourceTypes` property of
`Tags.of(...).add()`) for tags applied in this way.

---

##### `terminationProtection`<sup>Optional</sup> <a name="terminationProtection" id="raindancers-safemail.emailSecurity.MtaStsStackProps.property.terminationProtection"></a>

```typescript
public readonly terminationProtection: boolean;
```

- *Type:* boolean
- *Default:* false

Whether to enable termination protection for this stack.

---

##### `domain`<sup>Required</sup> <a name="domain" id="raindancers-safemail.emailSecurity.MtaStsStackProps.property.domain"></a>

```typescript
public readonly domain: string;
```

- *Type:* string

---

##### `hostedZone`<sup>Required</sup> <a name="hostedZone" id="raindancers-safemail.emailSecurity.MtaStsStackProps.property.hostedZone"></a>

```typescript
public readonly hostedZone: IHostedZone;
```

- *Type:* aws-cdk-lib.aws_route53.IHostedZone

---

##### `mode`<sup>Required</sup> <a name="mode" id="raindancers-safemail.emailSecurity.MtaStsStackProps.property.mode"></a>

```typescript
public readonly mode: MtaStsMode;
```

- *Type:* raindancers-safemail.emailSecurity.MtaStsMode

---

##### `maxAge`<sup>Optional</sup> <a name="maxAge" id="raindancers-safemail.emailSecurity.MtaStsStackProps.property.maxAge"></a>

```typescript
public readonly maxAge: number;
```

- *Type:* number

---

##### `mxPatterns`<sup>Optional</sup> <a name="mxPatterns" id="raindancers-safemail.emailSecurity.MtaStsStackProps.property.mxPatterns"></a>

```typescript
public readonly mxPatterns: string[];
```

- *Type:* string[]

---

### SpfConfig <a name="SpfConfig" id="raindancers-safemail.emailSecurity.SpfConfig"></a>

Configuration for the SPF TXT record published at the root of the domain.

*Example*

```typescript
// Self-hosted mail server with a static IP
emailSec.addSpf({
  ip4: ['203.0.113.10'],
  all: SpfQualifier.FAIL,
});
```


#### Initializer <a name="Initializer" id="raindancers-safemail.emailSecurity.SpfConfig.Initializer"></a>

```typescript
import { emailSecurity } from 'raindancers-safemail'

const spfConfig: emailSecurity.SpfConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#raindancers-safemail.emailSecurity.SpfConfig.property.a">a</a></code> | <code>boolean</code> | Authorize the IPv4 addresses in the domain's own A records to send mail. |
| <code><a href="#raindancers-safemail.emailSecurity.SpfConfig.property.all">all</a></code> | <code>raindancers-safemail.emailSecurity.SpfQualifier</code> | What to do with senders not matched by any mechanism. |
| <code><a href="#raindancers-safemail.emailSecurity.SpfConfig.property.include">include</a></code> | <code>string[]</code> | Delegate to another domain's SPF record. |
| <code><a href="#raindancers-safemail.emailSecurity.SpfConfig.property.ip4">ip4</a></code> | <code>string[]</code> | Explicitly authorize specific IPv4 addresses or CIDR ranges, e.g. `['203.0.113.10', '198.51.100.0/24']`. |
| <code><a href="#raindancers-safemail.emailSecurity.SpfConfig.property.ip6">ip6</a></code> | <code>string[]</code> | Explicitly authorize specific IPv6 addresses or CIDR ranges. |
| <code><a href="#raindancers-safemail.emailSecurity.SpfConfig.property.mx">mx</a></code> | <code>boolean</code> | Authorize the IP addresses of the domain's MX records to send mail. |

---

##### `a`<sup>Optional</sup> <a name="a" id="raindancers-safemail.emailSecurity.SpfConfig.property.a"></a>

```typescript
public readonly a: boolean;
```

- *Type:* boolean

Authorize the IPv4 addresses in the domain's own A records to send mail.

---

##### `all`<sup>Optional</sup> <a name="all" id="raindancers-safemail.emailSecurity.SpfConfig.property.all"></a>

```typescript
public readonly all: SpfQualifier;
```

- *Type:* raindancers-safemail.emailSecurity.SpfQualifier

What to do with senders not matched by any mechanism.

Defaults to `SpfQualifier.FAIL`.

---

##### `include`<sup>Optional</sup> <a name="include" id="raindancers-safemail.emailSecurity.SpfConfig.property.include"></a>

```typescript
public readonly include: string[];
```

- *Type:* string[]

Delegate to another domain's SPF record.

Use `SpfInclude` for well-known providers.

---

##### `ip4`<sup>Optional</sup> <a name="ip4" id="raindancers-safemail.emailSecurity.SpfConfig.property.ip4"></a>

```typescript
public readonly ip4: string[];
```

- *Type:* string[]

Explicitly authorize specific IPv4 addresses or CIDR ranges, e.g. `['203.0.113.10', '198.51.100.0/24']`.

---

##### `ip6`<sup>Optional</sup> <a name="ip6" id="raindancers-safemail.emailSecurity.SpfConfig.property.ip6"></a>

```typescript
public readonly ip6: string[];
```

- *Type:* string[]

Explicitly authorize specific IPv6 addresses or CIDR ranges.

---

##### `mx`<sup>Optional</sup> <a name="mx" id="raindancers-safemail.emailSecurity.SpfConfig.property.mx"></a>

```typescript
public readonly mx: boolean;
```

- *Type:* boolean

Authorize the IP addresses of the domain's MX records to send mail.

---



## Enums <a name="Enums" id="Enums"></a>

### AbuseReportCondition <a name="AbuseReportCondition" id="raindancers-safemail.emailSecurity.AbuseReportCondition"></a>

Controls whether DMARC failure source IPs are reported back to AbuseIPDB.

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#raindancers-safemail.emailSecurity.AbuseReportCondition.NEVER">NEVER</a></code> | Never report IPs back to AbuseIPDB. |
| <code><a href="#raindancers-safemail.emailSecurity.AbuseReportCondition.HIGH_CONFIDENCE_ONLY">HIGH_CONFIDENCE_ONLY</a></code> | Report only when both DKIM and SPF fail AND disposition is reject. |
| <code><a href="#raindancers-safemail.emailSecurity.AbuseReportCondition.ANY_FAILURE">ANY_FAILURE</a></code> | Report for any DMARC failure. |

---

##### `NEVER` <a name="NEVER" id="raindancers-safemail.emailSecurity.AbuseReportCondition.NEVER"></a>

Never report IPs back to AbuseIPDB.

Lookup only. Default.

---


##### `HIGH_CONFIDENCE_ONLY` <a name="HIGH_CONFIDENCE_ONLY" id="raindancers-safemail.emailSecurity.AbuseReportCondition.HIGH_CONFIDENCE_ONLY"></a>

Report only when both DKIM and SPF fail AND disposition is reject.

---


##### `ANY_FAILURE` <a name="ANY_FAILURE" id="raindancers-safemail.emailSecurity.AbuseReportCondition.ANY_FAILURE"></a>

Report for any DMARC failure.

---


### BedrockModelId <a name="BedrockModelId" id="raindancers-safemail.bedrock.BedrockModelId"></a>

Cross-region inference profile IDs for Anthropic Claude models on Amazon Bedrock.

> [https://docs.aws.amazon.com/bedrock/latest/userguide/inference-profiles.html](https://docs.aws.amazon.com/bedrock/latest/userguide/inference-profiles.html)

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#raindancers-safemail.bedrock.BedrockModelId.AU_HAIKU_4_5">AU_HAIKU_4_5</a></code> | *No description.* |
| <code><a href="#raindancers-safemail.bedrock.BedrockModelId.AU_SONNET_4_5">AU_SONNET_4_5</a></code> | *No description.* |
| <code><a href="#raindancers-safemail.bedrock.BedrockModelId.AU_SONNET_4_6">AU_SONNET_4_6</a></code> | *No description.* |
| <code><a href="#raindancers-safemail.bedrock.BedrockModelId.AU_OPUS_4_6">AU_OPUS_4_6</a></code> | *No description.* |
| <code><a href="#raindancers-safemail.bedrock.BedrockModelId.JP_HAIKU_4_5">JP_HAIKU_4_5</a></code> | *No description.* |
| <code><a href="#raindancers-safemail.bedrock.BedrockModelId.JP_SONNET_4_5">JP_SONNET_4_5</a></code> | *No description.* |
| <code><a href="#raindancers-safemail.bedrock.BedrockModelId.JP_SONNET_4_6">JP_SONNET_4_6</a></code> | *No description.* |
| <code><a href="#raindancers-safemail.bedrock.BedrockModelId.EU_HAIKU_4_5">EU_HAIKU_4_5</a></code> | *No description.* |
| <code><a href="#raindancers-safemail.bedrock.BedrockModelId.EU_SONNET_4_5">EU_SONNET_4_5</a></code> | *No description.* |
| <code><a href="#raindancers-safemail.bedrock.BedrockModelId.EU_SONNET_4_6">EU_SONNET_4_6</a></code> | *No description.* |
| <code><a href="#raindancers-safemail.bedrock.BedrockModelId.EU_OPUS_4_5">EU_OPUS_4_5</a></code> | *No description.* |
| <code><a href="#raindancers-safemail.bedrock.BedrockModelId.EU_OPUS_4_6">EU_OPUS_4_6</a></code> | *No description.* |
| <code><a href="#raindancers-safemail.bedrock.BedrockModelId.US_HAIKU_4_5">US_HAIKU_4_5</a></code> | *No description.* |
| <code><a href="#raindancers-safemail.bedrock.BedrockModelId.US_SONNET_4_5">US_SONNET_4_5</a></code> | *No description.* |
| <code><a href="#raindancers-safemail.bedrock.BedrockModelId.US_SONNET_4_6">US_SONNET_4_6</a></code> | *No description.* |
| <code><a href="#raindancers-safemail.bedrock.BedrockModelId.US_OPUS_4_5">US_OPUS_4_5</a></code> | *No description.* |
| <code><a href="#raindancers-safemail.bedrock.BedrockModelId.US_OPUS_4_6">US_OPUS_4_6</a></code> | *No description.* |
| <code><a href="#raindancers-safemail.bedrock.BedrockModelId.GLOBAL_HAIKU_4_5">GLOBAL_HAIKU_4_5</a></code> | *No description.* |
| <code><a href="#raindancers-safemail.bedrock.BedrockModelId.GLOBAL_SONNET_4_5">GLOBAL_SONNET_4_5</a></code> | *No description.* |
| <code><a href="#raindancers-safemail.bedrock.BedrockModelId.GLOBAL_SONNET_4_6">GLOBAL_SONNET_4_6</a></code> | *No description.* |
| <code><a href="#raindancers-safemail.bedrock.BedrockModelId.GLOBAL_OPUS_4_5">GLOBAL_OPUS_4_5</a></code> | *No description.* |
| <code><a href="#raindancers-safemail.bedrock.BedrockModelId.GLOBAL_OPUS_4_6">GLOBAL_OPUS_4_6</a></code> | *No description.* |

---

##### `AU_HAIKU_4_5` <a name="AU_HAIKU_4_5" id="raindancers-safemail.bedrock.BedrockModelId.AU_HAIKU_4_5"></a>

---


##### `AU_SONNET_4_5` <a name="AU_SONNET_4_5" id="raindancers-safemail.bedrock.BedrockModelId.AU_SONNET_4_5"></a>

---


##### `AU_SONNET_4_6` <a name="AU_SONNET_4_6" id="raindancers-safemail.bedrock.BedrockModelId.AU_SONNET_4_6"></a>

---


##### `AU_OPUS_4_6` <a name="AU_OPUS_4_6" id="raindancers-safemail.bedrock.BedrockModelId.AU_OPUS_4_6"></a>

---


##### `JP_HAIKU_4_5` <a name="JP_HAIKU_4_5" id="raindancers-safemail.bedrock.BedrockModelId.JP_HAIKU_4_5"></a>

---


##### `JP_SONNET_4_5` <a name="JP_SONNET_4_5" id="raindancers-safemail.bedrock.BedrockModelId.JP_SONNET_4_5"></a>

---


##### `JP_SONNET_4_6` <a name="JP_SONNET_4_6" id="raindancers-safemail.bedrock.BedrockModelId.JP_SONNET_4_6"></a>

---


##### `EU_HAIKU_4_5` <a name="EU_HAIKU_4_5" id="raindancers-safemail.bedrock.BedrockModelId.EU_HAIKU_4_5"></a>

---


##### `EU_SONNET_4_5` <a name="EU_SONNET_4_5" id="raindancers-safemail.bedrock.BedrockModelId.EU_SONNET_4_5"></a>

---


##### `EU_SONNET_4_6` <a name="EU_SONNET_4_6" id="raindancers-safemail.bedrock.BedrockModelId.EU_SONNET_4_6"></a>

---


##### `EU_OPUS_4_5` <a name="EU_OPUS_4_5" id="raindancers-safemail.bedrock.BedrockModelId.EU_OPUS_4_5"></a>

---


##### `EU_OPUS_4_6` <a name="EU_OPUS_4_6" id="raindancers-safemail.bedrock.BedrockModelId.EU_OPUS_4_6"></a>

---


##### `US_HAIKU_4_5` <a name="US_HAIKU_4_5" id="raindancers-safemail.bedrock.BedrockModelId.US_HAIKU_4_5"></a>

---


##### `US_SONNET_4_5` <a name="US_SONNET_4_5" id="raindancers-safemail.bedrock.BedrockModelId.US_SONNET_4_5"></a>

---


##### `US_SONNET_4_6` <a name="US_SONNET_4_6" id="raindancers-safemail.bedrock.BedrockModelId.US_SONNET_4_6"></a>

---


##### `US_OPUS_4_5` <a name="US_OPUS_4_5" id="raindancers-safemail.bedrock.BedrockModelId.US_OPUS_4_5"></a>

---


##### `US_OPUS_4_6` <a name="US_OPUS_4_6" id="raindancers-safemail.bedrock.BedrockModelId.US_OPUS_4_6"></a>

---


##### `GLOBAL_HAIKU_4_5` <a name="GLOBAL_HAIKU_4_5" id="raindancers-safemail.bedrock.BedrockModelId.GLOBAL_HAIKU_4_5"></a>

---


##### `GLOBAL_SONNET_4_5` <a name="GLOBAL_SONNET_4_5" id="raindancers-safemail.bedrock.BedrockModelId.GLOBAL_SONNET_4_5"></a>

---


##### `GLOBAL_SONNET_4_6` <a name="GLOBAL_SONNET_4_6" id="raindancers-safemail.bedrock.BedrockModelId.GLOBAL_SONNET_4_6"></a>

---


##### `GLOBAL_OPUS_4_5` <a name="GLOBAL_OPUS_4_5" id="raindancers-safemail.bedrock.BedrockModelId.GLOBAL_OPUS_4_5"></a>

---


##### `GLOBAL_OPUS_4_6` <a name="GLOBAL_OPUS_4_6" id="raindancers-safemail.bedrock.BedrockModelId.GLOBAL_OPUS_4_6"></a>

---


### DmarcPolicy <a name="DmarcPolicy" id="raindancers-safemail.emailSecurity.DmarcPolicy"></a>

DMARC policy applied to emails that fail SPF/DKIM alignment checks.

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#raindancers-safemail.emailSecurity.DmarcPolicy.NONE">NONE</a></code> | No action taken. |
| <code><a href="#raindancers-safemail.emailSecurity.DmarcPolicy.QUARANTINE">QUARANTINE</a></code> | Failing messages are sent to the recipient's spam/junk folder. |
| <code><a href="#raindancers-safemail.emailSecurity.DmarcPolicy.REJECT">REJECT</a></code> | Failing messages are rejected outright. |

---

##### `NONE` <a name="NONE" id="raindancers-safemail.emailSecurity.DmarcPolicy.NONE"></a>

No action taken.

Use for monitoring only — reports are still sent.

---


##### `QUARANTINE` <a name="QUARANTINE" id="raindancers-safemail.emailSecurity.DmarcPolicy.QUARANTINE"></a>

Failing messages are sent to the recipient's spam/junk folder.

---


##### `REJECT` <a name="REJECT" id="raindancers-safemail.emailSecurity.DmarcPolicy.REJECT"></a>

Failing messages are rejected outright.

Strongest protection.

---


### MtaStsMode <a name="MtaStsMode" id="raindancers-safemail.emailSecurity.MtaStsMode"></a>

Controls whether MTA-STS policy is actively enforced or in observation mode.

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsMode.ENFORCE">ENFORCE</a></code> | Receiving servers MUST use TLS. |
| <code><a href="#raindancers-safemail.emailSecurity.MtaStsMode.TESTING">TESTING</a></code> | Policy is published but not enforced. |

---

##### `ENFORCE` <a name="ENFORCE" id="raindancers-safemail.emailSecurity.MtaStsMode.ENFORCE"></a>

Receiving servers MUST use TLS.

Mail is rejected if TLS cannot be negotiated.

---


##### `TESTING` <a name="TESTING" id="raindancers-safemail.emailSecurity.MtaStsMode.TESTING"></a>

Policy is published but not enforced.

Use this to test before switching to ENFORCE.

---


### SpfInclude <a name="SpfInclude" id="raindancers-safemail.emailSecurity.SpfInclude"></a>

Well-known SPF `include:` targets for common email service providers.

Each value delegates SPF authorization to that provider's published SPF record.

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#raindancers-safemail.emailSecurity.SpfInclude.MICROSOFT_365">MICROSOFT_365</a></code> | Microsoft 365 / Exchange Online. |
| <code><a href="#raindancers-safemail.emailSecurity.SpfInclude.GOOGLE_WORKSPACE">GOOGLE_WORKSPACE</a></code> | Google Workspace (Gmail). |
| <code><a href="#raindancers-safemail.emailSecurity.SpfInclude.AMAZON_SES">AMAZON_SES</a></code> | Amazon SES. |
| <code><a href="#raindancers-safemail.emailSecurity.SpfInclude.SENDGRID">SENDGRID</a></code> | SendGrid. |
| <code><a href="#raindancers-safemail.emailSecurity.SpfInclude.MAILGUN">MAILGUN</a></code> | Mailgun. |
| <code><a href="#raindancers-safemail.emailSecurity.SpfInclude.MAILCHIMP">MAILCHIMP</a></code> | Mailchimp / Mandrill. |

---

##### `MICROSOFT_365` <a name="MICROSOFT_365" id="raindancers-safemail.emailSecurity.SpfInclude.MICROSOFT_365"></a>

Microsoft 365 / Exchange Online.

---


##### `GOOGLE_WORKSPACE` <a name="GOOGLE_WORKSPACE" id="raindancers-safemail.emailSecurity.SpfInclude.GOOGLE_WORKSPACE"></a>

Google Workspace (Gmail).

---


##### `AMAZON_SES` <a name="AMAZON_SES" id="raindancers-safemail.emailSecurity.SpfInclude.AMAZON_SES"></a>

Amazon SES.

---


##### `SENDGRID` <a name="SENDGRID" id="raindancers-safemail.emailSecurity.SpfInclude.SENDGRID"></a>

SendGrid.

---


##### `MAILGUN` <a name="MAILGUN" id="raindancers-safemail.emailSecurity.SpfInclude.MAILGUN"></a>

Mailgun.

---


##### `MAILCHIMP` <a name="MAILCHIMP" id="raindancers-safemail.emailSecurity.SpfInclude.MAILCHIMP"></a>

Mailchimp / Mandrill.

---


### SpfQualifier <a name="SpfQualifier" id="raindancers-safemail.emailSecurity.SpfQualifier"></a>

Controls what receiving servers do with mail that doesn't match any SPF mechanism (`all` qualifier).

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#raindancers-safemail.emailSecurity.SpfQualifier.PASS">PASS</a></code> | `+all` — authorize all senders not matched above. |
| <code><a href="#raindancers-safemail.emailSecurity.SpfQualifier.FAIL">FAIL</a></code> | `-all` — reject mail from senders not matched above. |
| <code><a href="#raindancers-safemail.emailSecurity.SpfQualifier.SOFTFAIL">SOFTFAIL</a></code> | `~all` — mark as suspicious but accept. |
| <code><a href="#raindancers-safemail.emailSecurity.SpfQualifier.NEUTRAL">NEUTRAL</a></code> | `?all` — no policy statement. Rarely used. |

---

##### `PASS` <a name="PASS" id="raindancers-safemail.emailSecurity.SpfQualifier.PASS"></a>

`+all` — authorize all senders not matched above.

Not recommended.

---


##### `FAIL` <a name="FAIL" id="raindancers-safemail.emailSecurity.SpfQualifier.FAIL"></a>

`-all` — reject mail from senders not matched above.

Recommended for production.

---


##### `SOFTFAIL` <a name="SOFTFAIL" id="raindancers-safemail.emailSecurity.SpfQualifier.SOFTFAIL"></a>

`~all` — mark as suspicious but accept.

Useful during migration/testing.

---


##### `NEUTRAL` <a name="NEUTRAL" id="raindancers-safemail.emailSecurity.SpfQualifier.NEUTRAL"></a>

`?all` — no policy statement. Rarely used.

---

