# OpenNeuro Documentation

Welcome to the OpenNeuro documentation site. OpenNeuro is a free and open platform
for sharing neuroimaging data.

## Getting started

If you are a looking for datasets, [OpenNeuro Search][OpenNeuro Search] allows you to search public
datasets.

If you are considering uploading datasets to OpenNeuro, or recommending OpenNeuro as
an upload host, please review our [](policy/data_retention.md) and
our [](policy/data_management_plans.md). When you
are ready to upload, check out our [](user_guide.md)!

## Getting help

If you're running into complications, we have several methods to help you resolve them.

To start, check whether our [{abbr}`FAQ (Frequently Asked Questions)`](./faq.md)
contains what you're looking for.

For general problems that would benefit from community expertise and advice,
we highly recommend looking to [NeuroStars](https://neurostars.org/) for assistance.
It is a public forum hosted by the
{abbr}`INCF (International Neuroinformatics Coordinating Facility)`
and there you'll be able to find experienced users of OpenNeuro and
{abbr}`BIDS (Brain Imaging Data Structure)`,
as well as experts in nearly any topic in neuroscience.

For problems with the site itself, or regarding potentially sensitive information,
users may submit issues to a help desk, using the "Support" link at the top of every page.

![Navigation bar, showing SUPPORT link](./assets/nav-bar-logged-out.png)

```{note}
Because support tickets require individual attention from a limited staff, and any resolution remains
private, we may refer you to a public forum where a broader audience has the opportunity to respond
and the results can be searched by future users with similar problems.
```

Finally, if you'd like to suggest a new feature for OpenNeuro, you can do so at
[OpenNeuro's User Suggestions](https://openneuro.featureupvote.com/).

```{toctree}
:hidden:

user_guide
faq
```

```{toctree}
:caption: OpenNeuro polices
:hidden:

policy/data_retention
policy/data_management_plans
```

## Advanced usage

In addition to the web interface, OpenNeuro provides three ways of interacting with the service:

```{toctree}
:caption: Advanced usage
:maxdepth: 1

packages/openneuro-cli
api
git
```

The {abbr}`CLI (command-line interface)` allows for data upload and download from the terminal,
which can be particularly useful for large datasets or poor connections.

The GraphQL API allows users to search for datasets or query metadata more flexibly than the web
interface.

We also provide direct [git](https://www.git-scm.com/) endpoints to datasets,
which enables working with private datasets with [DataLad](https://handbook.datalad.org/en/latest/usecases/openneuro.html).

## Developer resources

Developers interested in hosting an OpenNeuro instance or who are curious about the
structure of our package and hosting setup may be interested in the following sections.

```{toctree}
:caption: Developer resources
:maxdepth: 1

architecture
maintenance
Source repository (GitHub) <https://github.com/OpenNeuroOrg/openneuro>
```

[OpenNeuro Search]: https://openneuro.org/search
