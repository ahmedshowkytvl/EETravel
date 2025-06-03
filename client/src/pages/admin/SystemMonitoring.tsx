import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { 
  Server, 
  Database, 
  HardDrive, 
  Cpu, 
  MemoryStick,
  Wifi,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  RefreshCw,
  Settings,
  Download,
  Upload,
  Monitor,
  Clock
} from "lucide-react";

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  lastUpdated: string;
  services: {
    database: {
      status: 'online' | 'offline' | 'degraded';
      connections: number;
      maxConnections: number;
      responseTime: number;
    };
    api: {
      status: 'online' | 'offline' | 'degraded';
      responseTime: number;
      errorRate: number;
      requestsPerMinute: number;
    };
    storage: {
      status: 'online' | 'offline' | 'degraded';
      usedSpace: number;
      totalSpace: number;
      freeSpace: number;
    };
  };
  performance: {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    networkLatency: number;
  };
  securityAlerts: Array<{
    id: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    timestamp: string;
    resolved: boolean;
  }>;
  recentLogs: Array<{
    id: string;
    level: 'info' | 'warn' | 'error';
    message: string;
    timestamp: string;
    source: string;
  }>;
}

export default function SystemMonitoring() {
  const { data: systemHealth, isLoading, refetch } = useQuery<SystemHealth>({
    queryKey: ['/api/admin/system-health'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online': return 'text-green-600 bg-green-100';
      case 'warning':
      case 'degraded': return 'text-yellow-600 bg-yellow-100';
      case 'critical':
      case 'offline': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online': return <CheckCircle className="h-4 w-4" />;
      case 'warning':
      case 'degraded': return <AlertTriangle className="h-4 w-4" />;
      case 'critical':
      case 'offline': return <XCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">System Monitoring</h1>
            <p className="text-muted-foreground">
              Real-time system health and performance monitoring
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Logs
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Configure
            </Button>
          </div>
        </div>

        {/* System Status Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(systemHealth?.status || 'healthy')}>
                  {getStatusIcon(systemHealth?.status || 'healthy')}
                  <span className="ml-1 capitalize">{systemHealth?.status || 'healthy'}</span>
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Uptime: {formatUptime(systemHealth?.uptime || 0)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Database</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(systemHealth?.services?.database?.status || 'online')}>
                  {getStatusIcon(systemHealth?.services?.database?.status || 'online')}
                  <span className="ml-1 capitalize">{systemHealth?.services?.database?.status || 'online'}</span>
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {systemHealth?.services?.database?.connections || 0}/{systemHealth?.services?.database?.maxConnections || 100} connections
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Services</CardTitle>
              <Wifi className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(systemHealth?.services?.api?.status || 'online')}>
                  {getStatusIcon(systemHealth?.services?.api?.status || 'online')}
                  <span className="ml-1 capitalize">{systemHealth?.services?.api?.status || 'online'}</span>
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {systemHealth?.services?.api?.responseTime || 0}ms response time
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(systemHealth?.services?.storage?.status || 'online')}>
                  {getStatusIcon(systemHealth?.services?.storage?.status || 'online')}
                  <span className="ml-1 capitalize">{systemHealth?.services?.storage?.status || 'online'}</span>
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {formatBytes(systemHealth?.services?.storage?.freeSpace || 0)} free
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="performance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="logs">System Logs</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Monitor className="mr-2 h-5 w-5" />
                    Performance Metrics
                  </CardTitle>
                  <CardDescription>Real-time system performance indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium flex items-center">
                        <Cpu className="mr-2 h-4 w-4" />
                        CPU Usage
                      </span>
                      <span className="text-sm">{systemHealth?.performance?.cpuUsage || 0}%</span>
                    </div>
                    <Progress value={systemHealth?.performance?.cpuUsage || 0} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium flex items-center">
                        <MemoryStick className="mr-2 h-4 w-4" />
                        Memory Usage
                      </span>
                      <span className="text-sm">{systemHealth?.performance?.memoryUsage || 0}%</span>
                    </div>
                    <Progress value={systemHealth?.performance?.memoryUsage || 0} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium flex items-center">
                        <HardDrive className="mr-2 h-4 w-4" />
                        Disk Usage
                      </span>
                      <span className="text-sm">{systemHealth?.performance?.diskUsage || 0}%</span>
                    </div>
                    <Progress value={systemHealth?.performance?.diskUsage || 0} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium flex items-center">
                        <Wifi className="mr-2 h-4 w-4" />
                        Network Latency
                      </span>
                      <span className="text-sm">{systemHealth?.performance?.networkLatency || 0}ms</span>
                    </div>
                    <Progress value={Math.min((systemHealth?.performance?.networkLatency || 0) / 10, 100)} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Service Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="mr-2 h-5 w-5" />
                    Service Details
                  </CardTitle>
                  <CardDescription>Detailed service information and metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Database Service</span>
                      <Badge className={getStatusColor(systemHealth?.services?.database?.status || 'online')}>
                        {systemHealth?.services?.database?.status || 'online'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div>Response Time: {systemHealth?.services?.database?.responseTime || 0}ms</div>
                      <div>Connections: {systemHealth?.services?.database?.connections || 0}</div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">API Service</span>
                      <Badge className={getStatusColor(systemHealth?.services?.api?.status || 'online')}>
                        {systemHealth?.services?.api?.status || 'online'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div>Response Time: {systemHealth?.services?.api?.responseTime || 0}ms</div>
                      <div>Error Rate: {systemHealth?.services?.api?.errorRate || 0}%</div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Storage Service</span>
                      <Badge className={getStatusColor(systemHealth?.services?.storage?.status || 'online')}>
                        {systemHealth?.services?.storage?.status || 'online'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div>Used: {formatBytes(systemHealth?.services?.storage?.usedSpace || 0)}</div>
                      <div>Free: {formatBytes(systemHealth?.services?.storage?.freeSpace || 0)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Security Alerts
                </CardTitle>
                <CardDescription>Security monitoring and threat detection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {systemHealth?.securityAlerts?.length ? (
                    systemHealth.securityAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                          alert.severity === 'critical' ? 'text-red-500' :
                          alert.severity === 'high' ? 'text-orange-500' :
                          alert.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                        }`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{alert.message}</p>
                            <div className="flex items-center space-x-2">
                              <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                                {alert.severity}
                              </Badge>
                              <Switch checked={alert.resolved} />
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{alert.timestamp}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No security alerts detected</p>
                      <p className="text-sm">Your system is secure</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  System Logs
                </CardTitle>
                <CardDescription>Recent system events and error logs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {systemHealth?.recentLogs?.length ? (
                    systemHealth.recentLogs.map((log) => (
                      <div key={log.id} className="flex items-start space-x-3 p-3 border rounded-lg font-mono text-sm">
                        <Badge variant={
                          log.level === 'error' ? 'destructive' :
                          log.level === 'warn' ? 'secondary' : 'outline'
                        }>
                          {log.level}
                        </Badge>
                        <div className="flex-1">
                          <p className="break-all">{log.message}</p>
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>{log.source}</span>
                            <span>{log.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No recent logs available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>System Maintenance</CardTitle>
                  <CardDescription>Maintenance tasks and system optimization</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Clear Cache
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Database className="mr-2 h-4 w-4" />
                    Optimize Database
                  </Button>
                  <Button className="w-full" variant="outline">
                    <HardDrive className="mr-2 h-4 w-4" />
                    Clean Temporary Files
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Backup System
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Scheduled Tasks</CardTitle>
                  <CardDescription>Automated maintenance and backup schedules</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Daily Backup</p>
                      <p className="text-sm text-muted-foreground">Next: Today at 2:00 AM</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Weekly Reports</p>
                      <p className="text-sm text-muted-foreground">Next: Sunday at 12:00 PM</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Monthly Cleanup</p>
                      <p className="text-sm text-muted-foreground">Next: 1st of next month</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}