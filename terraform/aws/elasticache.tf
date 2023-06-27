resource "aws_elasticache_subnet_group" "elasticache-subnet-group" {
  name       = "elasticache-subnet-group"
  subnet_ids = [aws_subnet.private-subnet-elasticache.id] 
}

resource "aws_elasticache_replication_group" "example" {
  replication_group_id        = "example-replication-group"
  replication_group_description = "Example replication group"
  node_type                   = "cache.m5.large" # Update with desired node type
  engine_version              = "6.x" # Update with desired Redis version
  parameter_group_name        = "default.redis6.x.cluster.on" # Update with desired parameter group
  port                        = 6379 # Update with desired port
  automatic_failover_enabled  = true

  subnet_group_name = aws_elasticache_subnet_group.elasticache-subnet-group.name

  cluster_mode {
    replicas_per_node_group = 1
    num_node_groups         = 1
  }
}

output "redis_endpoint" {
  value = aws_elasticache_replication_group.example.primary_endpoint_address
}
