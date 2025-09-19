<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tests', function (Blueprint $table) {
            $table->id();
            $table->string('text');
            $table->string('reactive');
            $table->string('password');
            $table->string('email');
            $table->string('number');
            $table->string('textarea');
            $table->text('rich');
            $table->text('markdown');
            $table->date('date');
            $table->datetime('datetime');
            $table->date('fp_date');
            $table->datetime('fp_datetime');
            $table->json('keyvalue')->nullable();
            $table->boolean('toggle')->default(false);
            $table->string('radio');
            $table->string('checkbox')->nullable();
            $table->json('checkboxlist')->nullable();
            $table->json('tags')->nullable();
            $table->string('file')->nullable();
            $table->json('repeater')->nullable();
            $table->string('rating')->nullable();
            $table->string('single_select')->nullable();
            $table->json('multiple_select')->nullable();
            $table->string('single_select_search')->nullable();
            $table->json('multiple_select_search')->nullable();
            $table->string('single_combobox')->nullable();
            $table->json('multiple_combobox')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->timestamps();
        });

        User::factory()->count(100)->create();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tests');
    }
};
