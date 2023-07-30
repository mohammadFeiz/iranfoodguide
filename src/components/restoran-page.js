import React, { Component } from 'react';
import RVD from './../npm/react-virtual-dom/react-virtual-dom';
import AIOInput from '../npm/aio-button/aio-button';
import AIODate from '../npm/aio-date/aio-date';
import Map from './../npm/map/map';
import { Icon } from '@mdi/react';
import { mdiArrowRight, mdiChevronDown, mdiChevronUp, mdiClock, mdiClose, mdiComment, mdiTable, mdiWallet } from '@mdi/js';
import { icons } from './../icons';
import shandiz_logo from './../images/shandiz_logo.png';
import shandiz_image from './../images/shandiz_image.png';
import Rate from './../components/rate';
import SVG_Cart from './../svgs/cart';
import GroupButton from './group-button';
import percent1 from '../svgs/percent1';
import AppContext from '../app-context';
import SearchBox from './../npm/search-box/search-box';
import AIOShop from './../npm/aio-shop/aio-shop';
import ersal_ba_peyk_svg from '../svgs/ersal-ba-peyk';
import daryafte_hozoori_svg from '../svgs/daryafte-hozoori';
import pardakhte_online_src from '../images/pardakhte-online.png';
import pardakhte_kife_pool_src from '../images/pardakhte-kife-pool.png';
import kart_be_kart_src from '../images/kart-be-kart.png';
import pardakhte_hozoori_src from '../images/pardakhte-hozoori.png';
import SplitNumber from './../npm/aio-functions/split-number';
import './restoran-page.css';

export default class RestoranPage extends Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.state = {
      activeMenu: false,
      menuLength:0,
      menu: [],
      activeTabId:'menu',
      tabMode:true,
      coupons:[],
      cartTab:true
    }
  }
  getRestoranProp(prop){
    let {restoran} = this.props;
    return restoran[prop]
  }
  getIcon(option){
    let icon = {
      'ارسال با پیک':()=>ersal_ba_peyk_svg(),
      'دریافت حضوری':()=>daryafte_hozoori_svg(),
      'پرداخت آنلاین':()=><img src={pardakhte_online_src} />,
      'پرداخت کیف پول':()=><img src={pardakhte_kife_pool_src} />,
      'کارت به کارت':()=><img src={kart_be_kart_src} />,
      'پرداخت حضوری':()=><img src={pardakhte_hozoori_src} />,
    }[option];
    return (<div style={{width:60}} className='align-vh'>{icon()}</div>)
  }
  getShippingOptions({factor,shipping}){
    let { addresses } = this.context;
    let address = this.getRestoranProp('address');
    let {coupons} = this.state;
    return [
      {
          title:'روش تحویل سفارش',field:'deliveryType',value:'ارسال با پیک',
          options:[
              { text: 'ارسال با پیک', value: 'ارسال با پیک', icon: this.getIcon('ارسال با پیک') },
              { text: 'دریافت حضوری', value: 'دریافت حضوری', icon: this.getIcon('دریافت حضوری') },
          ]
      },
      {
          show:({deliveryType})=>deliveryType === 'ارسال با پیک',title:'آدرس تحویل سفارش',subtitle:'انتخاب از آدرس های من',field:'addressId',value:addresses[0].id,
          options:addresses.map(({address,id})=>{return { text: address, value: id }})
      },
      {type:'html',show:({deliveryType})=>deliveryType === 'دریافت حضوری',title:'آدرس تحویل سفارش',subtitle:'آدرس رستوران',html:()=>address},
      {
          title:'روش پرداخت مبلغ سفارش',field:'paymentType',value:'پرداخت آنلاین',
          options:[
              { text: 'پرداخت آنلاین', value: 'پرداخت آنلاین', icon: this.getIcon('پرداخت آنلاین'), subtext: 'پرداخت از طریق درگاه های پرداخت ' },
              { text: 'پرداخت کیف پول(10% تخفیف)', value: 'پرداخت کیف پول', icon: this.getIcon('پرداخت کیف پول'), subtext: 'مانده اعتبار : 250،000 ریال' },
              { text: 'پرداخت حضوری', value: 'پرداخت حضوری', icon: this.getIcon('پرداخت حضوری'), subtext: 'پرداخت از طریق دستگاه پوز پیک یا فروشگاه' },
              { text: 'کارت به کارت', value: 'کارت به کارت', icon: this.getIcon('کارت به کارت'), subtext: 'واریز به کارت ایران فود' }
          ]
      },
      {
        type:'html',
        show:({paymentType})=>paymentType === 'کارت به کارت',
        title:'اطلاعات حساب ایران فود',
        html:()=>'6219861033538751'
      },
      {
        title:'کوپن های تخفیف',field:'selectedCouponIds',value:[],show:()=>!!coupons.length,multiple:true,
        options:coupons.map(({id,title,discountPercent,discount,maxDiscount,minCartAmount = 0})=>{
          let subtext = '';
          if(discountPercent){
            subtext += `${discountPercent} درصد تخفیف `
          }
          else if(discount){
            subtext += `${SplitNumber(discount)} تومان تخفیف `
          }
          if(maxDiscount){ subtext += `تا سقف ${SplitNumber(maxDiscount)} تومان `}
          if(minCartAmount){subtext += `برای سبد بالای ${SplitNumber(minCartAmount)} تومان `}
          let disabled = minCartAmount > factor.total - factor.discount;
          return {text:title,subtext,value:id,disabled}
        })
      }
    ]
  }
  async componentDidMount() {
    let { apis } = this.context;
    let id = this.getRestoranProp('id');
    apis({
      api: 'get_restoran_foods',
      parameter: id,def:[],
      callback: (foods) => {
        let menu = {}
        let food_dic = {};
        let subFoods = {};
        let activeMenu;
        for(let i = 0; i < foods.length; i++){
          let food = foods[i];
          let {menuCategory,parentId,id} = food;
          food_dic[id] = food;
          if(!activeMenu){activeMenu = menuCategory;}
          if(parentId){
            subFoods[parentId] = subFoods[parentId] || [];
            subFoods[parentId].push(food);
            continue;
          }
          menu[menuCategory] = menu[menuCategory] || [];
          menu[menuCategory].push(food);
        }
        let keys = Object.keys(subFoods);
        for(let i = 0; i < keys.length; i++){
          let key = keys[i];
          food_dic[key].items = subFoods[key];
        }
        this.setState({ menu,activeMenu,menuLength:Object.keys(menu).length,subFoods })
      }
    })
    apis({
      api:'restoran_coupons',
      parameter:id,
      name:'دریافت کوپن های تخفیف رستوران',def:[],
      callback:(coupons)=>this.setState({coupons})
    })
    let Shop = AIOShop({
      id:'iranfoodrestorancart' + id,
      unit:'تومان',
      addText:'سفارش',
      cartCache:true,
      update:()=>this.setState({Shop:this.state.Shop}),
      getShippingOptions:this.getShippingOptions.bind(this),
      productFields:{id:'id',name:'name',price:'price',discountPercent:'discountPercent',description:'description',image:'image'},
      checkDiscountCode:()=>{
        return 123000;
        //return 'کد معتبر نیست'
      },
      getDiscounts:({shipping})=>{
        let {coupons} = this.state;
        let {selectedCouponIds = [],paymentType} = shipping;
        let discounts = [];
        if(paymentType === 'پرداخت کیف پول'){
          discounts.push({discountPercent:10,title:'تخفیف پرداخت با کیف پول'})
        }
        for(let i = 0; i < selectedCouponIds.length; i++){
          let id = selectedCouponIds[i];
          let coupon = coupons.find((coupon)=>coupon.id === id);
          discounts.push(coupon);
        }
        return discounts
      },
      getExtras:({shipping})=>{
        if(shipping.paymentType === 'پرداخت حضوری'){return 0}
        return {amount:53000,title:'هزینه ارسال'}
      }
    })
    this.setState({Shop})
  }
  header_layout(cartLength) {
    let { onClose } = this.props;
    let rate = this.getRestoranProp('rate');
    let image = this.getRestoranProp('image');
    let {cartTab,Shop} = this.state;
    return (
      {
        html:(
          <Header
            rate={rate}
            image={image}
            icons={[
              {icon:<Icon path={mdiClose} size={1}/>,onClick:()=>onClose()},
              {icon:SVG_Cart(),onClick:()=>Shop.openPopup('cart'),badge:cartLength,show:!cartTab},
            ]}
          />
        )
      }
    )
  }
  tabs_layout(cartLength){
    let {activeTabId,tabMode,cartTab} = this.state;
    if(!tabMode){return false}
    return {
      className:'m-b-12',
      html:(
        <AIOInput
          type='tabs'
          options={[
            {text:'منوی رستوران',value:'menu',style:{flex:1}},
            {text:'اطلاعات رستوران',value:'info',style:{flex:1}},
            {text:'سبد خرید',value:'cart',style:{flex:1},before:<div className='badge-2'>{cartLength}</div>,show:!!cartTab},
          ]}
          value={activeTabId}
          onChange={(activeTabId)=>this.setState({activeTabId})}
        />
      )
    }
  }
  category_layout() {
    let { activeMenu,menu,menuLength } = this.state;
    if(!menuLength){return false}
    return {
      className: 'p-h-12 m-b-12',
      html: (
        <GroupButton
          type='menu'
          value={[activeMenu]} className='outline'
          options={Object.keys(menu).map((o) => { return { text: o, value: o } })}
          onChange={(values, activeMenu) => this.setState({ activeMenu })}
        />
      )
    }
  }
  foods_layout() {
    let { menu,activeMenu,Shop } = this.state;
    if(!Shop){return false}
    if(!activeMenu){return false}
    let foods = menu[activeMenu];
    return {
      gap: 12, flex: 1, className: 'ofy-auto',
      column: foods.map((o) => {
        let {items = []} = o;
        let html;
        if(items.length){
          html = (
            <button className='joziate-ghaza button-2' onClick={()=>this.openPopup('subFoods',o)}>جزییات</button>
          )
        }
        return { className: 'p-h-12 of-visible', html: Shop.renderProductCard({product:o,config:{changeCart:true,html}}) }
      })
    }
  }
  openPopup(key,parameter){
    let {Shop,subFoods} = this.state;
    let {rsa_actions} = this.context;
    let {addPopup} = rsa_actions;
    if(key === 'subFoods'){
      addPopup({
        type:'fullscreen',title:`انواع ${parameter.name}`,
        body:()=>{
          return (
            <SubFoods food={parameter} subFoods={subFoods} Shop={Shop}/>
          )
        }
      })
    }
  }
  info_layout(){
    let {tabMode,activeTabId} = this.state;
    if(!tabMode || activeTabId !== 'info'){return false}
    let {restoran} = this.props;
    return {
      flex:1,
      html:<RestoranInfo {...restoran} header={false}/>
    }
  }
  cart_layout(){
    let {tabMode,activeTabId,Shop} = this.state;
    if(!tabMode || activeTabId !== 'cart'){return false}
    return {
      flex:1,
      html:Shop.renderCart()
    }
  }
  render() {
    let {tabMode,activeTabId,Shop} = this.state;
    let cartLength = Shop?Shop.getCartItems().length:0;
    
    return (
      <>
        <RVD
          layout={{
            className:'restoran-page',
            column: [
              this.header_layout(cartLength),
              this.tabs_layout(cartLength),
              {
                show:!tabMode || (tabMode && activeTabId === 'menu'),
                flex:1,
                column:[
                  this.category_layout(),
                  this.foods_layout()
                ]
              },
              this.info_layout(),
              this.cart_layout()
            ]
          }}
        />
        {Shop && Shop.renderPopups()}
      </>
    )
  }
}
class SubFoods extends Component{
  foods_layout(foods){
    let {Shop} = this.props;
    return {
      flex:1,className:'ofy-auto',gap:12,
      column:foods.map((o)=>{
        return { className: 'p-h-12 of-visible', html: Shop.renderProductCard({product:o,config:{changeCart:true}}) }
      })
    }
  }
  render(){
    let {food,subFoods} = this.props;
    let foods = subFoods[food.id];
    return (
      <RVD
        layout={{
          style:{background:'#f8f8f8',height:'100%'},
          column:[
            {size:12},
            this.foods_layout(foods)
          ]
        }}
      />
    )
  }
}
class Header extends Component{
  renderIcons(icons){
    let gap = 8;
    let size = 36;
    return icons.filter(({show = true})=>typeof show === 'function'?show():show).map(({icon,onClick,badge},i)=>{
      return (
        <div
          onClick={onClick}
          style={{
            position: 'absolute', background: '#ffffffdd', borderRadius: 6, display: 'flex',
            left: ((i + 1) * gap) + (i * size), top: 8, width: 36, height: 36
          }}
          className='align-vh'
        >
          {icon}
          {!!badge && <div className='badge-1'>{badge}</div>}
        </div>
      )
    })
  }
  renderTitle(title){
    if(!title){return null}
    return (
      <div
        style={{
          position: 'absolute', background: '#ffffffdd', borderRadius: 6, display: 'flex',padding:'0 12px',
          right: 8, top: 8, height: 36
        }}
        className='align-vh bold fs-20'
      >
        {title}
      </div>
    )
  }
  render(){
    let {icons = [],rate,image,title} = this.props;
    return (
        <RVD
          layout={{
            html: (
              <div style={{ position: 'relative', width: '100%' }}>
                <img src={image} width='100%' alt='' style={{ width: '100%' }} />
                {
                  !!rate && (
                    <div
                      style={{
                        position: 'absolute', background: '#ffffffcc', borderRadius: 6, display: 'flex',
                        right: 8, bottom: 16, width: 96, height: 24,color:'orange'
                      }}
                      className='align-vh'
                    >
                      <Rate rate={rate} />
                    </div>
                  )
                }
                {this.renderIcons(icons)}
                {this.renderTitle(title)}
              </div>
            )
          }}  
        />
      
    )
  }
}

class RestoranInfo extends Component {
  static contextType = AppContext;
  constructor(props){
    super(props);
    this.state = {
      comments:[],
      commentsPageSize:12,
      commentsPageNumber:1
    }
  }
  componentDidMount(){
    let {apis} = this.context;
    let {id} = this.props;
    let {commentsPageNumber,commentsPageSize} = this.state;
    apis({
      api:'restoran_comments',
      parameter:{id,pageSize:commentsPageSize,pageNumber:commentsPageNumber},
      name:'دریافت نظرات ثبت شده در مورد رستوران',
      callback:(comments)=>this.setState({comments})
    })
  }
  title_layout(logo,name,rate){
    let {onClose,header} = this.props;
    if(header === false){return false}
    return {
      className:'m-b-12 p-12 orange-bg colorFFF',
      row:[
        {size:36,html:<Icon path={mdiArrowRight} size={1}/>,align:'vh',onClick:()=>onClose()},
        {flex:1,html:<RestoranTitle {...{logo,name,rate}}/>}
      ]
    }
  }
  parts_layout(deliveryTime) {
    let {comments} = this.state;
    let parts = [
      { text: `${deliveryTime} دقیقه`, subtext: 'زمان ارسال', icon: mdiClock },
      //{text:`${shippingPrice} ریال`,subtext:'هزینه ارسال',icon:mdiWallet},
      { text: `${comments.length} نظر`, subtext: 'نظرات کاربران', icon: mdiComment },
      { text: `رزرو میز`, subtext: 'مشاهده میزها', icon: mdiTable, color: '#92C020' },
    ]
    return {
      gap: 1,
      className: 'restoran-page-parts',
      row: parts.map((o) => {
        return this.part_layout(o)
      })
    }
  }
  part_layout({ text, subtext, icon, color }) {
    return {
      flex: 1, style: { color },className:'restoran-page-part',
      column: [
        { html: <Icon path={icon} size={0.7} />, align: 'vh', style: { color: '#00AD79' } },
        { size: 4 },
        { html: text, className: 'fs-12 bold', align: 'h' },
        { html: subtext, className: 'fs-10', align: 'h' }
      ]
    }
  }
  address_layout(latitude,longitude,address){
    return {
      className:'m-b-12 p-h-12',html:<Address {...{latitude,longitude,address}}/>
    }
  }
  downloadMenu_layout(){
    return {
      className:'m-b-12 p-h-12',html:<button className='button-3 w-100 br-6 h-36'>دانلود منو رستوران</button>
    }
  }
  IranFoodComment_layout(ifRate,ifComment){
    return {
      className:'p-h-12',html:<IranFoodComment {...{ifRate,ifComment}}/>
    }
  }
  comments_layout(comments){
    return {html:<RestoranComments comments={comments}/>}
  }
  render() {
    let {latitude,longitude,address,deliveryTime,logo,name,rate,ifRate,ifComment} = this.props;
    let {comments} = this.state;
    return (
      <RVD
        layout={{
          className:'h-100',
          column: [
            this.title_layout(logo,name,rate),
            {
              flex:1,className:'ofy-auto',
              column:[
                this.parts_layout(deliveryTime,comments),
                this.address_layout(latitude,longitude,address),
                this.downloadMenu_layout(),
                {size:12},
                this.IranFoodComment_layout(ifRate,ifComment),
                {size:12},
                this.comments_layout(comments)
              ]
            }
          ]
        }}
      />
    )
  }
}
class RestoranCoupons extends Component{
  coupons_layout(coupons) {
    if (!coupons.length) { return false }
    return {
      className:'m-b-12',
      column: [
        { html: 'کوپن های تخفیف', className: 'fs-14 bold p-h-12' },
        { size: 6 },
        {
          className: 'p-6 ofx-auto',
          style: { background: '#FFC19C' },
          gap: 12, row: coupons.map((o) => this.coupon_layout(o))
        }
      ]
    }
  }
  coupon_layout({ percent, amount }) {
    return {
      style: { background: '#fff' },
      className: 'br-8 p-6',
      row: [
        { html: percent1(), align: 'vh', size: 30 },
        {
          column: [
            { flex: 1 },
            { show: !!percent, html: `${percent} درصد تخفیف`, className: "fs-10 bold" },
            { show: !!amount, html: `تا سقف ${amount / 1000} هزار تومان`, className: 'fs-9' },
            { flex: 1 }
          ]
        }
      ]
    }
  }
  render(){
    return (
      ''
    )
  }
}
class RestoranTitle extends Component{
  logo_layout(logo){
    if(!logo){return false}
    return { html: <img src={logo} width='100%' style={{ width: 42, height: 42, border: '1px solid #eee', borderRadius: '100%',background:'#fff' }} /> }
  }
  name_layout(name){
    return { html: name, className: 'fs-16 bold' }
  }
  distance_layout(distance){
    if(!distance){return false}
    return {
      row: [
        { html: icons('location', { color: '#292D32', width: 10, height: 12 }), align: 'vh' },
        { size: 3 },
        { html: () => `${distance} کیلومتر فاصله از شما`, className: 'fs-10 m-t-3', align: 'v' }
      ]
    }
  }
  rate_layout(rate){
    if(rate === undefined){return false}
    return {html:<Rate rate={rate}/>}
  }
  render(){
    let {logo,name,distance,rate} = this.props;
    return (
      <RVD
        layout={{
          row: [
            this.logo_layout(logo),
            { size: 6 },
            {
              flex: 1,
              column: [
                this.name_layout(name),
                {
                  row: [
                    this.distance_layout(distance),
                    this.rate_layout(rate)
                  ]
                }
              ]
            }
          ]
        } }
      />
    )
  }
}
class RestoranComments extends Component{
  header_layout(){
    return {html:'نظرات کاربران',className:'fs-14 bold m-b-6'}
  }
  comments_layout(comments){
    return {column:comments.map((o,i)=>this.comment_layout(o,i === 0,i === comments.length - 1))}
  }
  comment_layout({name,date,comment},isFirst,isLast){
    return {
      style:{borderBottom:'1px solid #eee',background:'#fff'},
      className:'p-6 br-6' + (isFirst?'':' br-t-0') + (isLast?'':' br-b-0'),
      column:[
        {
          size:36,
          row:[
            this.name_layout(name),
            {flex:1},
            this.date_layout(date)
          ]
        },
        {html:comment,className:'fs-12'},
        {size:12}
      ]
    }
  }
  name_layout(name){
    return {html:name,className:'fs-12 bold',align:'v'}
  }
  date_layout(date){
    let {day,hour,minute} = AIODate().getDelta({date});
    let html;
    if(day){html = `${day} روز پیش`}
    else if(hour){html = `${hour} ساعت پیش`}
    else if(minute){html = `${minute} دقیقه پیش`}
    else {html = 'چند لحظه پیش'}
    return {html,className:'fs-10 bold',align:'v'}
  }
  render(){
    let {comments} = this.props;
    return (
      <RVD
        layout={{
          style:{background:'#eee'},
          className:'p-12 br-12',
          column:[
            this.header_layout(),
            this.comments_layout(comments)
          ]
        }}
      />
    )
  }
}
class Address extends Component{
  map_layout(latitude,longitude){
    return {
      html:(
        <Map
          latitude={latitude}
          longitude={longitude}
          style={{width:84,height:84,borderRadius:12}}
        />
      )
    }
  }
  address_layout(address){
    return {flex:1,html:address,className:'fs-14'}
  }
  render(){
    let {address,latitude,longitude} = this.props;
    return (
      <RVD
        layout={{
          row:[
            this.map_layout(latitude,longitude),
            {size:12},
            this.address_layout(address)
          ]
        }}
      />
    )
  }
}
class IranFoodComment extends Component{
  state = {showMode:false}
  header_layout(ifRate){
    return {
      className:'m-b-12 fs-14 bold',
      row:[
        {html:'نظر تخصصی ایران فود'},
        {flex:1},
        {html:'امتیاز ایران فود',className:'fs-12',align:'v'},
        {size:3},
        {html:<Rate rate={ifRate}/>,align:'v',style:{color:'orange'}}
      ]
    }
  }
  body_layout(ifComment){
    let {showMore} = this.state;
    return {
      size:showMore?undefined:96,
      className:'fs-12 m-b-12',html:ifComment
    }
  }
  footer_layout(){
    let {showMore} = this.state;
    return {
      className:'colorGreen bold fs-14',
      row:[
        {flex:1},
        {html:!showMore?'بیشتر':'کمتر',onClick:()=>this.setState({showMore:!showMore})},
        {html:<Icon path={!showMore?mdiChevronDown:mdiChevronUp} size={.8}/>,align:'vh'}
      ]
    }
  }
  render(){
    let {ifRate,ifComment} = this.props;
    return (
      <RVD
        layout={{
          column:[
            this.header_layout(ifRate),
            this.body_layout(ifComment),
            this.footer_layout()
          ]
        }}
      
      />
    )
  }
}