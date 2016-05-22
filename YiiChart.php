<?php

/**
 * 
 * Example usage
 * 
$this->widget('YiiChart', [
    'type' => YiiChart::$TYPE_PIE,
    'graph_params' => [
        'pie_cx' => 250,
        'pie_cy' => 250,
        'pie_r' => 100,
        'pie_border_color' => '#fff',
    ],
    'data' => [
        [
            'value' => 123,
            'label' => 'asd',
            'color' => '#f00'
        ],
        [
            'value' => 789,
            'label' => 'qwe',
            'color' => '#0f0'
        ],
        [
            'value' => 345,
            'label' => 'zxc',
            'color' => '#00f'
        ]
    ]
]);
 * 
$this->widget('YiiChart', [
    'type' => YiiChart::$TYPE_ANALYTICS,
    'graph_params' => [
        'width' => 500,
        'height' => 500
    ],
    'data' => [
        [
            'value' => 123,
            'label' => 'asd'
        ],
        [
            'value' => 789,
            'label' => 'qwe'
        ],
        [
            'value' => 345,
            'label' => 'zxc'
        ]
    ]
]);
 * 
 */

class YiiChart extends CWidget {
    
    public static $TYPE_PIE = 'PIE';
    public static $TYPE_ANALYTICS = 'ANALYTICS';

    /**
     *
     * @var string  id wrapper-a za tabove
     */
    public $id = null;
    
    public $svg_width = 500;
    public $svg_height = 500;
    
    public $data = [];
    public $type = null;
    
    public $graph_params = [];
    
    public function run() 
    {   
        if ($this->id == null)
        {
            $this->id = SIMAHtml::uniqid();
        }
        
        if(empty($this->type))
        {
            $this->type = YiiChart::$TYPE_PIE;
        }
        
        $this->validateParams();
                
        echo $this->render('index',[]);
        
        $js_params = [
            'svg_width' => $this->svg_width,
            'svg_height' => $this->svg_height,
            'type' => $this->type,
            'data' => $this->data,
            'graph_params' => $this->graph_params,
        ];
        $json = CJSON::encode($js_params);
        $register_script = "$('#".$this->id."').yiiChart('init',$json);";
        Yii::app()->clientScript->registerScript(SIMAHtml::uniqid(), $register_script, CClientScript::POS_READY);
    }

    public function registerManual() {        
        $assets = dirname(__FILE__) . '/assets';
        $baseUrl = Yii::app()->assetManager->publish($assets);
        Yii::app()->clientScript->registerScriptFile($baseUrl . '/raphael.js', CClientScript::POS_HEAD);
        Yii::app()->clientScript->registerScriptFile($baseUrl . '/popup.js', CClientScript::POS_HEAD);
        Yii::app()->clientScript->registerScriptFile($baseUrl . '/pieChart.js', CClientScript::POS_HEAD);
        Yii::app()->clientScript->registerScriptFile($baseUrl . '/analytics.js', CClientScript::POS_HEAD);
        Yii::app()->clientScript->registerScriptFile($baseUrl . '/jquery.yiiChart.js', CClientScript::POS_HEAD);
    }
    
    private function validateParams()
    {
        if(empty($this->graph_params))
        {
            throw new Exception(Yii::t('YiiChart', 'GraphParamsEmpty'));
        }
        
        if(empty($this->data))
        {
            throw new Exception(Yii::t('YiiChart', 'DataIsEmpty'));
        }
        
        foreach($this->data as $data)
        {
            if(!isset($data['value']))
            {
                throw new Exception(Yii::t('YiiChart', 'NotSetDataValue'));
            }
            if(!isset($data['label']))
            {
                throw new Exception(Yii::t('YiiChart', 'NotSetDataLabel'));
            }
        }
        
        if($this->type === YiiChart::$TYPE_PIE)
        {
            $this->validatePieParams();
        }
        else if($this->type === YiiChart::$TYPE_ANALYTICS)
        {
            $this->validateAnalyticsParams();
        }
        else
        {
            throw new Exception(Yii::t('YiiChart', 'InvalidType'));
        }
    }

    private function validatePieParams()
    {        
        if(!isset($this->graph_params['pie_cx']))
        {
            throw new Exception(Yii::t('YiiChart', 'NotSetPieCx'));
        }
        if(!isset($this->graph_params['pie_cy']))
        {
            throw new Exception(Yii::t('YiiChart', 'NotSetPieCy'));
        }
        if(!isset($this->graph_params['pie_r']))
        {
            throw new Exception(Yii::t('YiiChart', 'NotSetPieR'));
        }
        
        if(!isset($this->graph_params['pie_border_color']))
        {
            $this->graph_params['pie_border_color'] = '#fff';
        }
    }
    
    private function validateAnalyticsParams()
    {
        if(!isset($this->graph_params['width']))
        {
            throw new Exception(Yii::t('YiiChart', 'NotSetWidth'));
        }
        if(!isset($this->graph_params['height']))
        {
            throw new Exception(Yii::t('YiiChart', 'NotSetHeight'));
        }
        
        if(!isset($this->graph_params['grid_columns_num']))
        {
            $this->graph_params['grid_columns_num'] = 10;
        }
        if(!isset($this->graph_params['grid_rows_num']))
        {
            $this->graph_params['grid_rows_num'] = 10;
        }
        if(!isset($this->graph_params['grid_color']))
        {
            $this->graph_params['grid_color'] = '#000';
        }
        if(!isset($this->graph_params['leftgutter']))
        {
            $this->graph_params['leftgutter'] = 30;
        }
        if(!isset($this->graph_params['bottomgutter']))
        {
            $this->graph_params['bottomgutter'] = 20;
        }
        if(!isset($this->graph_params['topgutter']))
        {
            $this->graph_params['topgutter'] = 20;
        }
    }
}
