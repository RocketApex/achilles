# Security Policy

## Supported Versions

Only the latest minor release of Achilles `1.x` receives security fixes.

| Version | Supported |
| --- | --- |
| `1.x` | Yes |
| `< 1.0` | No |

## Reporting A Vulnerability

Please do not open a public GitHub issue for security vulnerabilities.

Report security issues by email:

```text
jey@jeygeethan.com
```

Include:

- affected Achilles version
- Rails version
- Ruby version
- a description of the vulnerability
- reproduction steps or proof of concept
- whether the issue is already public

## Response Expectations

You should receive an acknowledgement within 7 days.

If the issue is confirmed, the fix will be prepared privately when practical and
released with a changelog entry that gives users enough information to upgrade
without exposing unnecessary exploit details before a fix is available.

## Scope

Security reports are most useful when they involve Achilles behavior directly,
including:

- unsafe DOM lifecycle behavior
- asset/importmap packaging issues
- Rails engine integration issues
- behavior that could cause applications to execute unintended JavaScript

General application security issues in apps that use Achilles should be reported
to those applications instead.
