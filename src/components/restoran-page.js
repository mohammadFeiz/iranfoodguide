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
import Card from '../card/card';
import GroupButton from './group-button';
import percent1 from '../svgs/percent1';
import AppContext from '../app-context';
import SearchBox from './search-box';

export default class RestoranPage extends Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.state = {
      category: props.tags[0],
      foods: [],
      showInfo:false
    }
  }
  async componentDidMount() {
    let { apis } = this.context;
    let { id } = this.props;
    apis({
      api: 'ghaza_haye_restoran',
      parameter: id,
      callback: (foods) => {
        this.setState({ foods })
      }
    })
  }
  header_layout() {
    let { image, rate, onClose } = this.props
    return {
      html: (
        <div style={{ position: 'relative', width: '100%' }}>
          <img src={image} width='100%' alt='' style={{ width: '100%' }} />
          <div
            style={{
              position: 'absolute', background: '#ffffffcc', borderRadius: 6, display: 'flex',
              right: 8, bottom: 16, width: 96, height: 24,color:'orange'
            }}
            className='align-vh'
          >
            <Rate rate={rate} />
          </div>
          <div
            onClick={() => onClose()}
            style={{
              position: 'absolute', background: '#ffffffdd', borderRadius: 6, display: 'flex',
              left: 8, top: 8, width: 36, height: 36
            }}
            className='align-vh'
          >
            <Icon path={mdiClose} size={1} />
          </div>
        </div>
      )
    }
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
        {
          flex: 1,
          html: (
            <SearchBox onChange={(searchValue) => this.setState({ searchValue })} />
          )
        },
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
    let { foods } = this.state;
    return {
      gap: 12, flex: 1, className: 'ofy-auto',
      column: foods.map((o) => {
        return { className: 'p-h-12 of-visible', html: <Card type='card3' product={o} /> }
      })
    }
  }
  render() {
    let {showInfo} = this.state;
    if(showInfo){return <RestoranInfo {...this.props} onClose={()=>this.setState({showInfo:false})}/>}
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

RestoranPage.defaultProps = {
  name: 'رستوران 1', image: shandiz_image, logo: shandiz_logo,id:'1233445',
  rate: 3.4,ifRate:4, distance: 3, time: 35, tags: ['ایرانی', 'کبابی', 'فست فود', 'خارجی', 'سالادبار', 'عربی', 'صبحانه'],
  address:'تهران خیابان شیخ بهایی خیابان نوربخش پلاک 30 واحد 4 طبقه دوم',
  ifComment:'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می‌باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می‌طلبد تا با نرم‌افزارها شناخت بیشتری را برای طراحان رایانه ای علی‌الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می‌توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساساً مورد استفاده قرار گیرد'
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
        {html:<Rate rate={ifRate}/>,align:'v'}
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