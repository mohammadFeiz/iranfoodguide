import React, { Component } from "react";
import logo from './../../svgs/logo';
import png1 from './../../images/png1.png';
import comminsoonSVG from './../../svgs/commin-soon';
import iranfoodguideSVG from './../../svgs/iranfoodguide';
import RVD from './../../npm/react-virtual-dom';
import AppContext from "../../app-context";
import './comming-soon.css';
export default class CommingSoon extends Component {
    static contextType = AppContext;
    state = { phone: '',submited:false}
    async onSubmit(){
        let {apis} = this.context;
        let {phone,submited} = this.state;
        if(submited){
            this.setState({submited:false,phone:''});
            return;
        }
        if(!phone){return}
        let res = await apis.request({api:'sabte_shomare_tamas',parameter:phone,description:'ثبت شماره تماس'})
        if(res !== false){
            this.setState({submited:true})
        }
    }
    header_layout(type){
        return (
            {
                row: [
                    { html: logo({fill:type === 'xs'?'#fff':undefined}) },
                    { flex: 1 },
                    { html: '021 - 1234698', className: 'h-48 bgFF5900 colorFFF align-vh p-h-24 br-24', style: { direction: 'ltr' } }
                ]
            }
        )
    }
    body_layout_big(){
        let { phone,submited } = this.state;
        return {
            column:[
                {html: comminsoonSVG({width:'300',height:'300'}), align: 'vh'},
                {html: 'می خوای زودتر از همه اطلاع پیدا کنی ؟ شمارتو وارد کن', align: 'vh',className:'fs-14'},
                {size:24},
                {
                    row:[
                        {
                            align:'h',style:{boxSizing:'border-box'},
                            html: (
                                <input
                                    className='h-48 p-h-24 colorFFF no-border br-12 bgECECED' type='text' value={phone}
                                    placeholder='شماره موبایل خود را وارد کنید '
                                    style={{boxSizing:'border-box',width:260,color:'#000',textAlign:'center'}}
                                    onChange={(e) => this.setState({ phone: e.target.value })}
                                />
                            )
                        },
                        {size:12},
                        { html: <button onClick={()=>this.onSubmit()} className='h-48 p-h-24 bgFF5900 colorFFF no-border br-12'>{submited?'شماره شما ثبت شد':'ثبت شماره'}</button>,align:'vh' },    
                    ]
                }
            ]
        }
    }
    render() {
        let { phone,submited } = this.state;
        return (
            <>
                <RVD
                    layout={{
                        className: 'fullscreen p-12 bgFFF bg-comming-soon ofy-auto', show_xs: true,
                                flex: 1,
                                column: [
                                    this.header_layout('xs'),
                                    { flex: 1 ,style:{minHeight:24}},
                                    {
                                        html: comminsoonSVG({ width: 240, height: 240,style:{background:'rgba(255,255,255,0.7)',padding:12,borderRadius:12} }), align: 'vh'
                                    },
                                    {size:12},
                                    {
                                        html: <div style={{background:'rgba(255,255,255,0.7)',textAlign:'center',display:'flex',flexDirection:'column'}} className='align-vh br-12 p-12 w-240'>
                                            <div>{`می خوای زودتر از همه اطلاع پیدا کنی ؟`}</div>
                                            <div>{`شمارتو وارد کن`}</div>
                                        </div>, 
                                        align: 'vh', className: 'fs-12 bold'
                                    },
                                    { size: 12 },
                                    {
                                        align:'h',style:{boxSizing:'border-box'},
                                        html: (
                                            <input
                                                className='h-48 p-h-24 colorFFF no-border br-12 bgECECED' type='text' value={phone}
                                                placeholder='شماره موبایل خود را وارد کنید '
                                                style={{boxSizing:'border-box',width:260,background:'rgba(255,255,255,0.7)',color:'#000',textAlign:'left'}}
                                                onChange={(e) => this.setState({ phone: e.target.value })}
                                            />
                                        )
                                    },
                                    {size:12},
                                    { html: <button onClick={()=>this.onSubmit()} className='h-48 p-h-24 bgFF5900 colorFFF no-border br-12' style={{border:'1px solid #fff',width:260}}>{submited?'شماره شما ثبت شد':'ثبت شماره'}</button>,align:'vh' },    
                                    { flex: 2 }
                                ]
                        
                    }}
                />
                <RVD
                    layout={{
                        className: 'fullscreen ofy-auto',style:{background:'#eee'},hide_xs:true,
                        row:[
                            {flex:1},
                            {
                                style:{background:'#fff',padding:24},
                                row: [
                                    {
                                        style: { maxWidth: 1100,minWidth:400 },
                                        className:'of-auto',
                                        column: [
                                            this.header_layout(),
                                            { flex: 1 ,style:{minHeight:24}},
                                            this.body_layout_big(),
                                            { flex: 1 }
                                        ]
                                    },
                                    { size: 24 },
                                    {
                                        flex:1,html: <img src={png1} width='100%' alt='' className='br-24' style={{maxWidth:400}} />
                                    },
                                ]
                            },
                            {flex:1}
                        ]
                    }}
                />
            </>
        )
    }
}


