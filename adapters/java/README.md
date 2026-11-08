# Java / Spring Boot policy reference

Copy `VaradaPolicies.java` into the matching Java package or adjust its package declaration. It has no external JAR dependency. Use verified Spring Security authentication/authorization and tenant-bound JPA/JDBC queries; do not use frontend roles as authority. The core Java record is a *contract reference*, not a complete Spring Boot starter.

Compile: `javac -d /tmp/varada-java adapters/java/VaradaPolicies.java`. Apply the same negative-path contract tests as the JS implementations.
