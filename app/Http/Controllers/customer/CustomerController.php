<?php

namespace App\Http\Controllers\customer;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class CustomerController extends BaseController
{
    public function getAddressList(){
        return view::make('sub_list/customer/customer_address_list');
    }
}
