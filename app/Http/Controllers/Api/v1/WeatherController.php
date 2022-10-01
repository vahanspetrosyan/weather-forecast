<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\WeatherData;
use Illuminate\Support\Facades\Response;
use Illuminate\Http\Request;

class WeatherController extends Controller
{
    public function saveData(Request $request)
    {
        $response = [
            'status' => 'OK',
            'message' => '',
            'data' => ''
        ];
        $statusCode = 200;
        try {
            $city_name = $request->get('city_name');
            $min_temp = $request->get('min_temp');
            $max_temp = $request->get('max_temp');
            $wind_speed = $request->get('wind_speed');
            $date = $request->get('date');

            $weather = WeatherData::byCityName($city_name)->first();
            if($weather) {
                $weather->min_temp = $min_temp;
                $weather->max_temp = $max_temp;
                $weather->wind_speed = $wind_speed;
                $weather->date = $date;
                $weather->updated_at = NOW();
                $weather->save();
                $response['message'] = $city_name . ' weather is successfully updated in DB';
            } else {
                WeatherData::create([
                    'city_name' => $city_name,
                    'min_temp' => $min_temp,
                    'max_temp' => $max_temp,
                    'wind_speed' => $wind_speed,
                    'date' => $date
                ]);
                $response['message'] = $city_name . ' weather is successfully created in DB';
            }

        } catch (\Exception $e) {
            $response['status'] = 'ERROR';
            $response['message'] = $e->getMessage();
            $statusCode = 404;
        } finally {
            return Response::json($response, $statusCode);
        }
    }

    public function getDataDB(Request $request)
    {
        $response = [
            'status' => 'OK',
            'message' => '',
            'data' => ''
        ];
        $statusCode = 200;
        try {
            $city_name = $request->get('city');
            $weather = WeatherData::byCityName($city_name)->first();
            if ($weather) {
                $generated_data = [];
                $generated_data[] = [
                    'date' => $weather->date,
                    'temp_min' => $weather->min_temp,
                    'temp_max' => $weather->max_temp,
                    'wind_speed' => $weather->wind_speed,
                ];
                $response['data'] = [
                    'weather' => $generated_data,
                    'updated_at' => $weather->updated_at->toDateTimeString(),
                    'city_name' => $weather->city_name
                ];
            } else {
                $response['status'] = 'ERROR';
                $response['message'] = 'City not found in DB';
            }
        } catch (\Exception $e) {
            $response['status'] = 'ERROR';
            $response['message'] = $e->getMessage();
            $statusCode = 404;
        } finally {
            return Response::json($response, $statusCode);
        }
    }

    public function getData(Request $request)
    {
        $response = [
            'status' => 'OK',
            'message' => '',
            'data' => ''
        ];
        $statusCode = 200;
        try {
            $city_name = $request->get('city');
            $parms = [];
            $parms['q'] = $city_name;
            $parms['units'] = 'metric';
            $parms['appid'] = 'e4b8b08c185638b825af37facfe1fabb';
            $client = $this->CallAPI('GET', "https://api.openweathermap.org/data/2.5/forecast", $parms);

            $client_resp = json_decode($client, true);
            if ($client_resp['cod'] === '200') {
                $generated_data = [];
                $start_date = '';
                $end_date = '';
                foreach ($client_resp['list'] as $key => $value) {
                    if ($key === 0)
                        $start_date = $value['dt_txt'];
                    elseif ($key === count($client_resp['list']) - 1)
                        $end_date = $value['dt_txt'];
                    $generated_data[] = [
                        'date' => $value['dt_txt'],
                        'temp_min' => $value['main']['temp_min'],
                        'temp_max' => $value['main']['temp_max'],
                        'wind_speed' => $value['wind']['speed'],
                    ];
                }
                $response['data'] = [
                    'weather' => $generated_data,
                    'starts_at' => $start_date,
                    'ends_at' => $end_date,
                    'city_name' => $client_resp['city']['name']
                ];
            } else if ($client_resp['cod'] === '404') {
                $response['status'] = 'ERROR';
                $response['message'] = $client_resp['message'];
            } else {
                throw new \Exception('Wrong client response');
                // dd($client_resp);
            }
        } catch (\Exception $e) {
            $response['status'] = 'ERROR';
            $response['message'] = $e->getMessage();
            $statusCode = 404;
        } finally {
            return Response::json($response, $statusCode);
        }
    }

    protected function CallAPI($method, $url, $data = false)
    {
        $curl = curl_init();
        switch ($method) {
            case "POST":
                curl_setopt($curl, CURLOPT_POST, 1);
                if ($data)
                    curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
                break;
            case "PUT":
                curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PUT");
                if ($data)
                    curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
                break;
            default:
                if ($data)
                    $url = sprintf("%s?%s", $url, http_build_query($data));
        }

        // OPTIONS:
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
        ));

        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);

        // EXECUTE:
        $result = curl_exec($curl);
        if (!$result) {
            die("Connection Failure");
        }
        curl_close($curl);
        return $result;
    }
}
