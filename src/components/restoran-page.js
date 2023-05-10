import React, { Component } from 'react';
import RVD from './../npm/react-virtual-dom/react-virtual-dom';
import AIOButton from '../npm/aio-button/aio-button';
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
import SearchBox from './search-box';
import AIOShop from './../npm/aio-shop/aio-shop';
import ersal_ba_peyk_svg from '../svgs/ersal-ba-peyk';
import daryafte_hozoori_svg from '../svgs/daryafte-hozoori';
import pardakhte_online_src from '../images/pardakhte-online.png';
import pardakhte_kife_pool_src from '../images/pardakhte-kife-pool.png';
import kart_be_kart_src from '../images/kart-be-kart.png';
import pardakhte_hozoori_src from '../images/pardakhte-hozoori.png';

export default class RestoranPage extends Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.state = {
      Shop:AIOShop({
        id:'iranfoodrestorancart' + props.id,cartCache:true,
        setState:(Shop)=>this.setState({Shop}),
        productFields:{
          id:'id',
          name:'name',
          price:'price',
          discountPercent:'discountPercent',
          description:'description',
          image:'image'
        }
      }),
      category: props.tags[0],
      foods: [],
      showInfo:false,
      showCart:true
    }
  }
  async componentDidMount() {
    let { apis } = this.context;
    let { id } = this.props;
    apis({
      api: 'restoran_foods',
      parameter: id,
      callback: (foods) => {
        this.setState({ foods })
      }
    })
  }
  header_layout() {
    let { image, rate, onClose } = this.props;
    let {Shop} = this.state;
    let cartLength = Shop.getCart_list().length;
    return (
      {
        html:(
          <Header
            rate={rate}
            image={image}
            icons={[
              {icon:<Icon path={mdiClose} size={1}/>,onClick:()=>onClose()},
              {icon:SVG_Cart(),onClick:()=>this.setState({showCart:true}),badge:cartLength},
            ]}
          />
        )
      }
    )
  }
  title_layout() {
    let { logo, name, distance } = this.props;
    return {
      className: 'p-h-12 m-b-12',
      row: [
        {flex:1,html:<RestoranTitle {...{logo, name, distance}}/>},
        {
          align: 'v',
          html: (
            <AIOButton
              type='button'
              text={'مشاهده اطلاعات'}
              className='button-3'
              onClick={()=>this.setState({showInfo:true})}
            />
          )
        }
      ]
    }
  }
  categories_layout() {
    let { tags } = this.props;
    let { category } = this.state;
    return {
      className: 'p-h-12',
      html: (
        <GroupButton
          value={[category]} className='outline'
          options={tags.map((o) => { return { text: o, value: o } })}
          onChange={(values, value) => this.setState({ category: value })}
        />
      )
    }
  }
  filter_layout() {
    let { tags } = this.props;
    let { category } = this.state;
    return {
      className: 'p-h-12 m-b-12',
      row: [
        {flex: 1,html: <SearchBox onChange={(searchValue) => this.setState({ searchValue })} />},
        { size: 12 },
        {
          html: (
            <AIOButton
              className='select-2' type='select' value={category} options={tags} optionText='option' optionValue='option'
              onChange={(category) => this.setState({ category })} style={{ width: 90 }}
            />
          )
        }
      ]
    }
  }
  foods_layout() {
    let { foods,Shop } = this.state;
    return {
      gap: 12, flex: 1, className: 'ofy-auto',
      column: foods.map((o) => {
        return { className: 'p-h-12 of-visible', html: Shop.renderProductCard(o,{addCart:'سفارش',changeCart:true}) }
      })
    }
  }
  render() {
    let {showInfo,showCart,Shop} = this.state;
    if(showInfo){return <RestoranInfo {...this.props} onClose={()=>this.setState({showInfo:false})}/>}
    if(showCart){return <RestoranCart {...this.props} Shop={Shop} onClose={()=>this.setState({showCart:false})}/>}
    return (
      <RVD
        layout={{
          column: [
            this.header_layout(),
            this.title_layout(),
            this.filter_layout(),
            this.foods_layout()
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
    return icons.map(({icon,onClick,badge},i)=>{
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
  render(){
    let {icons = [],rate,image} = this.props;
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
                {
                  this.renderIcons(icons)
                }
              </div>
            )
          }}  
        />
      
    )
  }
}
RestoranPage.defaultProps = {
  name: 'رستوران 1', image: shandiz_image, logo: shandiz_logo,id:'1233445',
  rate: 3.4,ifRate:4, distance: 3, time: 35, tags: ['ایرانی', 'کبابی', 'فست فود', 'خارجی', 'سالادبار', 'عربی', 'صبحانه'],
  address:'تهران خیابان شیخ بهایی خیابان نوربخش پلاک 30 واحد 4 طبقه دوم',
  ifComment:'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می‌باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می‌طلبد تا با نرم‌افزارها شناخت بیشتری را برای طراحان رایانه ای علی‌الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می‌توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساساً مورد استفاده قرار گیرد'
}

class RestoranCart extends Component{
  constructor(props){
    super(props);
    this.state = {
      discounts:[
        {title:'تخفیف گروه مشتری',discountPercent:25},
        {title:'تخفیف نوروزی',discount:50000},
      ]
    }
  }
  header_layout(image){
    let {onClose} = this.props;
    return {
      html:(
        <Header
          image={image}
          icons={[
            {icon:<Icon path={mdiClose} size={1}/>,onClick:()=>onClose()}
          ]}
        />
      )
    }
  }
  title_layout(logo,name,distance,rate){
    return {html:<RestoranTitle {...{logo,name,distance,rate}}/>}
  }
  items_layout(cartItems,Shop){
    if(!cartItems.length){return {html:'سبد خرید شما خالی است',align:'vh'}}
    return {
      className:'m-b-24 of-visible',
      column:[
        {html:'سبد خرید',align:'vh',size:48,className:'fs-18 bold'},
        {
          flex:1,className:'of-visible',gap:12,
          column:cartItems.map(({product})=>{
            return {className:'p-h-12 of-visible',html:Shop.renderProductCard(product,{changeCart:true})}
          })
        }
      ]
    }
  }
  shipping_layout(){
    let {address} = this.props;
    return {
      html:<Shipping restoranAddress={address}/>
    }
  }
  factor_layout(cartItems,Shop){
    if(!cartItems.length){return false}
    let {discounts} = this.state;
    return {html:Shop.renderFactor(discounts),className:'p-12 br-6 m-h-12',style:{background:'#fff',border:'1px solid #ddd'}}
  }
  render(){
    let {image,Shop} = this.props;
    let cartItems = Shop.getCart_list()
    return (
      <RVD
        layout={{
          className:'ofy-auto bgFFF',
          column:[
            this.header_layout(image),
            //this.title_layout(logo,name,distance,rate),
            this.items_layout(cartItems,Shop),
            this.shipping_layout(),
            this.factor_layout(cartItems,Shop),
          ]
        }}
      />
    )
  }
}
class Shipping extends Component{
  static contextType = AppContext;
  constructor(props){
    super(props);
    this.state = {deliveryType:'ارسال با پیک',discountCode:'',paymentType:'پرداخت آنلاین'}
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
    if(!icon){debugger;}
    icon = icon();
    return (
      <div style={{width:60}} className='align-vh'>
        {icon}
      </div>
    )
  }
  deliveryType_layout(){
    let {deliveryType} = this.state;
    return {
      className:'p-h-12 m-b-24',
      column:[
        {html:'روش تحویل سفارش',className:'bold fs-16'},
        {
          html:(
            <AIOButton
              type='radio'
              options={[
                {text:'ارسال با پیک',value:'ارسال با پیک',before:this.getIcon('ارسال با پیک')},
                {text:'دریافت حضوری',value:'دریافت حضوری',before:this.getIcon('دریافت حضوری')},
              ]}
              optionStyle='{width:"100%",borderBottom:"1px solid #bbb"}'
              optionClassName='"bold fs-14"'
              value={deliveryType}
              onChange={(deliveryType)=>this.setState({deliveryType})}
            />
          )
        }
      ]
    }
  }
  deliveryAddress_layout(){
    let {deliveryType} = this.state;
    let {restoranAddress} = this.props;
    let {addresses} = this.context;
    return {
      className:'p-h-12 m-b-24',
      column:[
        {
          row:[
            {html:`آدرس تحویل سفارش`,className:'bold fs-16',align:'v'},
            {size:6},
            {html:`( ${deliveryType === 'ارسال با پیک'?'انتخاب از آدرس های من':'آدرس رستوران'} )`,className:'fs-12',align:'v'}
          ]
        },
        {size:12},
        {
          show:deliveryType === 'ارسال با پیک',
          html:()=>(
            <AIOButton
              type='select'
              className='select-3'
              options={addresses}
              optionText='option.address'
              popupWidth='fit'
              optionValue='option.id'
              value={addresses[0].id}
            />
          )
        },
        {
          show:deliveryType === 'دریافت حضوری',
          html:restoranAddress,className:'fs-12'
        }
      ]
    }
  }
  paymentType_layout(){
    let {paymentType} = this.state;
    return {
      className:'p-h-12 m-b-24',
      column:[
        {html:'روش پرداخت مبلغ سفارش',className:'bold fs-16'},
        {
          html:(
            <AIOButton
              type='radio'
              options={[
                {text:'پرداخت آنلاین',value:'پرداخت آنلاین',before:this.getIcon('پرداخت آنلاین'),subtext:'پرداخت از طریق درگاه های پرداخت '},
                {text:'پرداخت کیف پول',value:'پرداخت کیف پول',before:this.getIcon('پرداخت کیف پول'),subtext:'مانده اعتبار : 250،000 ریال'},
                {text:'پرداخت حضوری',value:'پرداخت حضوری',before:this.getIcon('پرداخت حضوری'),subtext:'پرداخت از طریق دستگاه پوز پیک یا فروشگاه'},
                {text:'کارت به کارت',value:'کارت به کارت',before:this.getIcon('کارت به کارت'),subtext:'واریز به کارت ایران فود'},
              ]}
              optionStyle='{width:"100%",borderBottom:"1px solid #bbb"}'
              optionClassName='"bold fs-14"'
              optionText='option'
              optionValue='option'
              value={paymentType}
              onChange={(paymentType)=>this.setState({paymentType})}
            />
          )
        }
      ]
    }
  }
  render(){
    return (
      <RVD
        layout={{
          column:[
            this.deliveryType_layout(),
            this.deliveryAddress_layout(),
            this.paymentType_layout()
          ]
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
      coupons:[],
    }
  }
  componentDidMount(){
    let {apis} = this.context;
    let {id} = this.props;
    apis({
      api:'restoran_comments',
      parameter:id,
      name:'دریافت نظرات ثبت شده در مورد رستوران',
      callback:(comments)=>this.setState({comments})
    })
    apis({
      api:'restoran_coupons',
      parameter:id,
      name:'دریافت کوپن های تخفیف رستوران',
      callback:(coupons)=>this.setState({coupons})
    })
  }
  title_layout(logo,name,rate){
    let {onClose} = this.props;
    return {
      className:'m-b-12 p-12 orange-bg colorFFF',
      row:[
        {size:36,html:<Icon path={mdiArrowRight} size={1}/>,align:'vh',onClick:()=>onClose()},
        {flex:1,html:<RestoranTitle {...{logo,name,rate}}/>}
      ]
    }
  }
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
      className: 'br-8',
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
  parts_layout(time) {
    let {comments} = this.state;
    let parts = [
      { text: `${time} دقیقه`, subtext: 'زمان ارسال', icon: mdiClock },
      //{text:`${shippingPrice} ریال`,subtext:'هزینه ارسال',icon:mdiWallet},
      { text: `${comments.length} نظر`, subtext: 'نظرات کاربران', icon: mdiComment },
      { text: `رزرو میز`, subtext: 'مشاهده میزها', icon: mdiTable, color: '#92C020' },
    ]
    return {
      gap: 1, gapAttrs: { style: { background: '#aaa' } },
      className: 'm-b-12',
      row: parts.map((o) => {
        return this.part_layout(o)
      })
    }
  }
  part_layout({ text, subtext, icon, color }) {
    return {
      flex: 1, style: { color },
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
      className:'m-b-12 p-h-12',html:<RestoranAddress {...{latitude,longitude,address}}/>
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
    let {latitude,longitude,address,time,logo,name,rate,ifRate,ifComment} = this.props;
    let {coupons,comments} = this.state;
    return (
      <RVD
        layout={{
          className:'bgFFF',
          column: [
            this.title_layout(logo,name,rate),
            {
              flex:1,className:'ofy-auto',
              column:[
                this.parts_layout(time,comments),
                this.coupons_layout(coupons),
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
class RestoranAddress extends Component{
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
    return {flex:1,html:address,className:'bold fs-14',align:'v'}
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