<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Schedule queue worker to restart every hour
        $schedule->command('queue:restart')->hourly();
        
        // Clean up failed jobs daily
        $schedule->command('queue:prune-failed --hours=48')->daily();
        
        // Cache clear weekly
        $schedule->command('cache:clear')->weekly();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}