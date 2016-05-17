const my_news = [
  {
    author: 'User1',
    text: 'User1 test text',
    bigText: 'Stub stub stub stub stub stub stub stub stub stub stub stub stub stub'
  },
  {
    author: 'User2',
    text: 'User2 test text',
    bigText: 'Stub stub stub stub stub stub stub stub stub stub stub stub stub stub'
  },
  {
    author: 'User3',
    text: 'User3 test text',
    bigText: 'Stub stub stub stub stub stub stub stub stub stub stub stub stub stub'
  }
];

window.ee	=	new	EventEmitter();

const App = React.createClass({
  getInitialState: function() {
    return {
      news: my_news
    };
  },

  componentDidMount: function() {
    const self = this;
    window.ee.addListener('News.add', function(item) {
      const nextNews = item.concat(self.state.news);
      self.setState({news: nextNews});
    });
  },

  componentWillUnmount: function() {
    window.ee.removeListener('News.add');
  },

  render: function() {
    return (
      <div className='app'>
        <Add />
        <h3>News</h3>
        <News data={this.state.news} />
      </div>
    );
  }
});

const Article = React.createClass({
  propTypes: {
    data: React.PropTypes.shape({
      author: React.PropTypes.string.isRequired,
      text: React.PropTypes.string.isRequired,
      bigText: React.PropTypes.string.isRequired
    })
  },

  getInitialState: function() {
    return {
      visible: false
    };
  },

  readmoreClick: function(e) {
    e.preventDefault();
    this.setState({visible: true});
  },

  render: function() {
    const author = this.props.data.author;
    const text = this.props.data.text;
    const bigText = this.props.data.bigText;
    const visible = this.state.visible;

    return (
      <div className='article'>
        <p className='news__author'>{author}:</p>
        <p className='news__text'>{text}</p>

        <a href='#' onClick={this.readmoreClick} className={'news__readmore ' + (visible ? 'none' : '')}>Read More</a>

        <p className={'news__big-text ' + (visible ? ' ' : 'none')}>{bigText}</p>
      </div>
    )
  }
});

const News = React.createClass({
  render: function() {
    const data = this.props.data;
    let newsTemplate;

    if (data.length) {
      newsTemplate = data.map((item, index) => {
        return (
          <div key={index}> {/* never use index as a key - bugs! For example - open app -> first record -> click 'read more' -> add new record -> bug -> 'read more' clicked for new record */}
            <Article data={item} />
          </div>
        )
      });
    } else {
      newsTemplate = <p>No news</p>
    }

    return (
      <div className='news'>
        {newsTemplate}
        <hr></hr>
        <strong className={'news__count ' + (data.length > 0 ? '':'none')}>Total news: {data.length}</strong>
      </div>
    )
  }
});

const Add = React.createClass({
  componentDidMount: function() {
    ReactDOM.findDOMNode(this.refs.author).focus();
  },

  getInitialState: function() {
    return {
      agreeNotChecked: true,
      authorIsEmpty: true,
      textIsEmpty: true
    };
  },

  onBtnClickHandler: function(e)	{
    e.preventDefault();
    const textEl = ReactDOM.findDOMNode(this.refs.text);
    const author = ReactDOM.findDOMNode(this.refs.author).value;
    const text = textEl.value;
    const bigText = '...';
    const item = [{
      author,
      text,
      bigText, /* https://github.com/airbnb/javascript point 19.2 */
    }];

    window.ee.emit('News.add', item);

    textEl.value = '';
    this.setState({textIsEmpty: true});
  },

  onFieldChange: function(fieldName, e) {
    if (e.target.value.trim().length > 0) {
      this.setState({[fieldName]: false})
    } else {
      this.setState({[fieldName]: true})
    }
  },

  onCheckRuleClick: function(e) {
    this.setState({agreeNotChecked: !this.state.agreeNotChecked});
  },

  render: function() {
    const agreeNotChecked = this.state.agreeNotChecked;
    const authorIsEmpty = this.state.authorIsEmpty;
    const textIsEmpty = this.state.textIsEmpty;

    return (
      <form className='add cf'>
        <input
          type='text'
          className='add__author'
          defaultValue=''
          ref='author'
          placeholder='Enter text'
          onChange={this.onFieldChange.bind(this, 'authorIsEmpty')}
        />

        <textarea
          className='add__text'
          defaultValue=''
          onChange={this.onFieldChange.bind(this, 'textIsEmpty')}
          placeholder='Text of news'
          ref='text'
        ></textarea>

        <label className='add__checkrule'>
          <input type='checkbox' ref='checkrule' onChange={this.onCheckRuleClick}/>I Agree
        </label>

        <button
          className='add__btn'
          onClick={this.onBtnClickHandler}
          ref='alert_button'
          disabled={agreeNotChecked	||	authorIsEmpty	||	textIsEmpty}
          >
          Add news
        </button>
      </form>
    );
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
