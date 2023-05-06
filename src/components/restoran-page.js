import React, { Component } from 'react';
import RVD from './../npm/react-virtual-dom/react-virtual-dom';
import AIOButton from '../npm/aio-button/aio-button';
import {Icon} from '@mdi/react';
import { mdiClock, mdiComment, mdiTable, mdiWallet } from '@mdi/js';
import { icons } from './../icons';
import shandiz_logo from './../images/shandiz_logo.png';
import shandiz_image from './../images/shandiz_image.png';
import Rate from './../components/rate';
import Card from '../card/card';
import GroupButton from './group-button';
import percent1 from '../svgs/percent1';
import AppContext from '../app-context';

export default class RestoranPage extends Component{
    static contextType = AppContext;
    constructor(props){
      super(props);
      this.state = {
        category:props.tags[0],
        foods:[],
      }
    }
    async componentDidMount(){
        let {apis} = this.context;
        let {id} = this.props;
        apis({
            api:'ghaza_haye_restoran',
            parameter:id,
            callback:(foods)=>{
                this.setState({foods})
            }
        })
    }
    header_layout(){
      let {image,rate} = this.props
      return {
        html:(
          <div style={{position:'relative',width:'100%'}}>
            <img src={image} width='100%' alt='' style={{width:'100%'}}/>
            <div 
              style={{
                position:'absolute',background:'#ffffffcc',borderRadius:6,display:'flex',
                right:8,bottom:16,width:96,height:24
              }}
              className='align-vh'
            >
              <Rate rate={rate}/>
            </div>
          </div>
        )
      }
    }
    title_layout(){
      let {logo,name,distance} = this.props;
      return {
        className: 'p-h-12 m-b-12',
        row: [
            { show:!!logo,html:()=> <img src={logo} width='100%' style={{ width: 42, height: 42, border: '1px solid #eee', borderRadius: '100%' }} /> },
            { size: 6 },
            {
                flex:1,
                column: [
                    { html: name, className: 'fs-14 bold' },
                    {
                        row: [
                            {
                                show:!!distance,
                                row:[
                                    { html: icons('location', { color: '#292D32',width:10,height:12 }), align: 'vh' },
                                    {size:3},
                                    { html:()=> `${distance} کیلومتر فاصله از شما`, className: 'fs-10 m-t-3', align: 'v' }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                align:'v',
                html:(
                    <AIOButton
                        type='button'
                        text={'مشاهده اطلاعات'}
                        className='button-3'
                        popOver={()=><RVD layout={{...this.info_layout(),style:{width:'100vw',padding:6}}}/>}
                    />
                )
            }
        ]
      }
    }
    info_layout(){
        return {
            column:[
                this.parts_layout(),
                this.coupons_layout()
            ]
        }
    }
    coupons_layout(){
        let {coupons = []} = this.props;
        if(!coupons.length){return false}
        return {
            column:[
                {html:'کوپن های تخفیف',className:'fs-14 bold'}, 
                {size:6},
                {
                    className:'p-6 ofx-auto',
                    style:{background:'#FFC19C'},
                    gap:12,row:coupons.map((o)=>this.coupon_layout(o))
                }
            ]
        }
    }
    coupon_layout({percent,amount}){
        return {
            style:{background:'#fff'},
            className:'p-6 br-8',
            row:[
                {html:percent1(),align:'vh',size:30},
                {
                    column:[
                        {flex:1},
                        {show:!!percent,html:`${percent} درصد تخفیف`,className:"fs-10 bold"},
                        {show:!!amount,html:`تا سقف ${amount / 1000} هزار تومان`,className:'fs-9'},
                        {flex:1}
                    ]
                }

            ]
        }
    }
    parts_layout(){
      let {time,shippingPrice = 20000,comments = 300} = this.props;
      let parts = [
        {text:`${time} دقیقه`,subtext:'زمان ارسال',icon:mdiClock},
        //{text:`${shippingPrice} ریال`,subtext:'هزینه ارسال',icon:mdiWallet},
        {text:`${comments} نظر`,subtext:'نظرات کاربران',icon:mdiComment},
        {text:`رزرو میز`,subtext:'مشاهده میزها',icon:mdiTable,color:'#92C020'},
      ]
      return {
        gap:1,gapAttrs:{style:{background:'#aaa'}},
        className:'m-b-12',
        row:parts.map((o)=>{
          return this.part_layout(o)
        })
      }
    }
    part_layout({text,subtext,icon,color}){
      return {
        flex:1,style:{color},
        column:[
          {html:<Icon path={icon} size={0.7}/>,align:'vh',style:{color:'#00AD79'}},
          {size:4},
          {html:text,className:'fs-12 bold',align:'h'},
          {html:subtext,className:'fs-10',align:'h'}
        ]
      }
    }
    categories_layout(){
        let {tags} = this.props;
        let {category} = this.state;
        return {
            className:'p-h-12',
            html:(
                <GroupButton 
                    value={[category]} className='outline'
                    options={tags.map((o)=>{return {text:o,value:o}})} 
                    onChange={(values,value)=>this.setState({category:value})}
                />
            )
        }
    }
    foods_layout(){
        let {foods} = this.state;
        return {
            gap:12,flex:1,className:'ofy-auto',
            column:foods.map((o)=>{
                return {className:'p-h-12 of-visible',html:<Card type='card3' {...o}/>}
            })
        }
    }
    render(){
      return (
        <RVD
          layout={{
            column:[
              this.header_layout(),
              this.title_layout(),
              //this.info_layout(),
              this.categories_layout(),
              this.foods_layout()
            ]
          }}
        />
      )
    }
  }
  
  RestoranPage.defaultProps = {
    name: 'رستوران 1',image: shandiz_image,logo: shandiz_logo,
    rate: 3.4,distance: 3,time: 35,tags: ['ایرانی', 'کبابی', 'فست فود','خارجی','سالادبار','عربی','صبحانه'],
    coupons:[
        {percent: 10, amount: 100000},
        {percent: 10, amount: 100000},
        {percent: 10, amount: 100000},
        {percent: 10, amount: 100000},
        {percent: 10, amount: 100000},
        {percent: 10, amount: 100000}
    ]
  }