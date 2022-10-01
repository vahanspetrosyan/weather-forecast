<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WeatherData extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'weather_data';

    /**
     * @var string[]
     */
    protected $fillable = [
        'city_name',
        'min_temp',
        'max_temp',
        'wind_speed',
        'date'
    ];

    /**
     * @param $query
     * @param $service
     * @return mixed
     */
    public function scopeByCityName($query, $service)
    {
        return $query->where('city_name', '=', $service);
    }

}
