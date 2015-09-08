/** @jsx React.DOM */
var PAGE_SIZE = 12;
React.initializeTouchEvents(true);
var App = React.createClass({
    getInitialState: function() {
        return {
            pageSize: PAGE_SIZE
        }
    },
    render: function() {
        return <div>
        
          <TopicListing pageSize={this.state.pageSize}/>   
        </div>
    }
});

var TopicListing = React.createClass({
    getInitialState: function() {
        return {
            currentPage: 1,
            topics:[]
        }
    },
    componentDidMount: function() {
        var component = this;
        $.getJSON('/users/updatebyregionorfilterchange/?start=' + 0 + '&end=' + PAGE_SIZE, function (data) {
        
            if (this.isMounted()) {
                component.setState({
                    topics: data,
                });
            }
        }.bind(this));
    }, 
    componentWillReceiveProps: function(nextProps) {
        this.setState({
            currentPage: 1,
        })
    }, 
    render: function() {
        var page = this.getPage();

        var propStyle = {display: 'inline-block'};

        var propCells = page.topics.map(function (topic) {
            
            var length = topic.title.length;
            var random =  "img/" + (length % 6 + 1) + ".jpg";
         
            var date = topic.date;
            date = date.replace(/-/g, " ");
            date = date.replace(/:/g, " ");
            var res = date.split(" ");
            var dt = new Date(res[0], res[1], res[2], res[3], res[4])

            return <div className="col-md-3 col-xs-3 mix cat_nature cat_all" style={propStyle}> 
                    <a className="thumbnail-item"> 
                        <img src={random} alt={topic.title} /> 
                        <div className="thumbnail-info"> 
                            <p>{topic.location}</p> 
                            <button className="btn btn-primary"><span className="fa fa-eye"></span></button> 
                        </div> 
                    </a> 
                    <div className="thumbnail-data"> 
                        <h5>${topic.price} - {topic.title}</h5> 
                        <p><span className = "displayregion">{topic.region}</span> {dt.toDateString()}</p> 
                    
                    </div> 
                </div>;
        });
        
        return <div>
                <div className="row mix-grid thumbnails" id="props1">{propCells.slice(0,4)}</div>
                <div className="row mix-grid thumbnails" id="props2">{propCells.slice(4,8)}</div>
                <div className="row mix-grid thumbnails" id="props3">{propCells.slice(8)}</div>
        {pager(page)}
        </div>;
    },
    /**
     * Gets the current page of topics along with some pagination info.
     */
    getPage: function() {
        var start = this.props.pageSize * (this.state.currentPage - 1)
        var end = start + this.props.pageSize
        var newData
    
        return {
            currentPage: this.state.currentPage
            , topics    :this.state.topics
            , numPages: this.getNumPages()
            , handleClick: function(pageNum) {
                return function() { this.handlePageChange(pageNum) }.bind(this)
            }.bind(this)
        }
    }, 
    getNumPages: function() {
        var totalCount;

        $.ajax({
            url: '/users/getTotalCount',
            dataType: 'json',
            async: false,
            success: function(data) {
                totalCount=data;
               
            }
        });
        var numPages = Math.floor(totalCount / this.props.pageSize);
    
        return numPages
    }, 
    handlePageChange: function(pageNum) {
        var component = this;
        var start = (pageNum -1)*12;
        var end= pageNum * 12;
        this.setState({currentPage: pageNum})
        $.getJSON('/users/updatebyregionorfilterchange/?start=' + start + '&end=' + end, function (data) {        
            component.setState({
                topics: data,
            });

        });
    }
})

/**
 * Renders a pager component.
 */
function pager(page) {
    var pageLinks = []
    if (page.currentPage > 1) {
        if (page.currentPage > 2)
            pageLinks.push(<li><a onClick={page.handleClick(1)} onTouchEnd={page.handleClick(1)}>«</a></li>);
else
            pageLinks.push(<li className="disabled"><a>«</a></li>);
            pageLinks.push(<li><a onClick={page.handleClick(page.currentPage - 1)} onTouchEnd={page.handleClick(page.currentPage - 1)}>‹</a></li>);
}
else
{
    pageLinks.push(<li className="disabled"><a>«</a></li>);
    pageLinks.push(<li className="disabled"><a>‹</a></li>);
}
pageLinks.push(<li className="active"><a>Page {page.currentPage} of {page.numPages}</a></li>);
if (page.currentPage < page.numPages) {
    pageLinks.push(<li><a onClick={page.handleClick(page.currentPage + 1)} onTouchEnd = {page.handleClick(page.currentPage + 1) }>›</a></li>);
if (page.currentPage < page.numPages - 1)
pageLinks.push(<li><a onClick={page.handleClick(page.numPages)} onTouchEnd={page.handleClick(page.numPages)}>»</a></li>);
else
            pageLinks.push(<li className="disabled"><a onClick={page.handleClick(page.numPages)} onTouchEnd={page.handleClick(page.numPages)}>»</a></li>);
}
else
{
    pageLinks.push(<li className="disabled"><a>›</a></li>);
    pageLinks.push(<li className="disabled"><a>»</a></li>);
}
return <ul className="pagination pagination-sm pull-right">{pageLinks}</ul>;
}

React.render(<App/>, document.getElementById('propListing'));

