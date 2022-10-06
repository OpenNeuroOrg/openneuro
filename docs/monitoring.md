---
name: Kubernetes Monitoring
route: /monitoring
orphan: true
---

# Infrastructure Monitoring

OpenNeuro is running Prometheus and Grafana for general monitoring and alerting. The Grafana dashboard is deployed at https://monitoring.openneuro.org and an account must be requested to access it.

## Install

A preconfigured secret is required for SMTP credentials.

```shell
kubectl --namespace monitoring create secret generic smtp-login --from-file=user=smtp-username.txt --from-file=password=smtp-password.txt
```

These services are deployed with the stable helm charts for Prometheus and Grafana.

```shell
helm --namespace monitoring install prometheus stable/prometheus
helm --namespace monitoring install grafana stable/grafana -f helm/grafana.yaml
```

## Upgrades

To apply new configuration or update a service, run helm upgrade.

```shell
helm --namespace monitoring upgrade grafana stable/grafana -f helm/grafana.yaml
```
