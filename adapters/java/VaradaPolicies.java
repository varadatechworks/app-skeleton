package com.varadatechworks.skeleton;

import java.util.*;
/** Independent JVM policy reference: consuming Spring Boot app supplies verified principal and DB checks. */
public final class VaradaPolicies {
 private VaradaPolicies() {}
 public record Scope(String tenantId, String level, String id) {}
 public record GeoNode(String tenantId, String id, String parentId, String level) {}
 public record Location(double latitude, double longitude, Double accuracyMeters, String source) {
  public Location {
   if (!Double.isFinite(latitude)||latitude < -90||latitude>90||!Double.isFinite(longitude)||longitude< -180||longitude>180)
    throw new IllegalArgumentException("Invalid coordinates");
   if(accuracyMeters!=null&&(!Double.isFinite(accuracyMeters)||accuracyMeters<0))throw new IllegalArgumentException("Invalid accuracy");
  }
 }
 public static boolean allowed(Set<String> verifiedRoles, Map<String,Map<String,Set<String>>> grants, String feature, String action){
  return verifiedRoles!=null&&grants!=null&&verifiedRoles.stream().anyMatch(r->grants.getOrDefault(r,Map.of()).getOrDefault(feature,Set.of()).contains(action));
 }
 public static boolean contains(List<GeoNode> nodes,Scope scope,Scope target){
  if(scope==null||target==null||scope.tenantId()==null||!scope.tenantId().equals(target.tenantId()))return false;
  Map<String,GeoNode> map=new HashMap<>();for(GeoNode n:nodes)if(scope.tenantId().equals(n.tenantId()))map.put(n.id(),n);
  Set<String> visited=new HashSet<>();GeoNode current=map.get(target.id());
  while(current!=null&&visited.add(current.id())) {if(current.id().equals(scope.id()))return current.level().equals(scope.level());current=map.get(current.parentId());}
  return false;
 }
}
