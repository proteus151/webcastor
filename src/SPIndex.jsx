// Switchport index table JSX component
const React = require('react');
const {Table, Column, Cell} = require('fixed-data-table');
var SPStore = require('./SPStore');
var CastorActions = require('./CastorActions');

class SPTextCell extends React.Component {
  render() {
    const {rowIndex, field, detailsIndex, data, ...props} = this.props;
    var style = {};
    if ( rowIndex == detailsIndex )
      style={backgroundColor:'#AFCFD0'};
    return (
      <Cell {...props} style={style}>
        {data[rowIndex][field]}
      </Cell>
      );
  }
}

class SPPlugCell extends React.Component {
  render() {
    const {rowIndex, field, detailsIndex, data, ...props} = this.props;
    var style = {};
    if ( rowIndex == detailsIndex )
      style={backgroundColor:'#AFCFD0'};
    var fname = "/static/castor/unusedport2.gif";
    if (data[rowIndex][field] == true)
      fname = "/static/castor/usedport2.gif";
    return (
      <Cell {...props} style={style}>
        {<img src={fname} style={{width:"30px",height:"24px"}} />}
      </Cell>
    );
  }
}

class SPIndex extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = SPStore.getState();
    this.tableHeight = 340;
    this.tabbedPanelWidth = 610;
    this.rowHeight = 40;
    this.headerHeight = 0;
    this.onResize = this.onResize.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.detailsIndex = 0;
  }

  componentWillUnmount() {
    SPStore.unlisten(this.onChange);
    window.removeEventListener('resize', this.onResize);
  }

  componentDidMount() {
    SPStore.listen(this.onChange);
    window.addEventListener('resize', this.onResize);
  }

  onResize(e) {
      this.forceUpdate();
  }

  onChange(newState) {
    this.state = newState;
    console.log('Updating SPIndex view');
    this.forceUpdate();
  }

  onRowClick(e, idx) {
    this.detailsIndex = idx;
    CastorActions.setDetailView(idx);
    this.forceUpdate();
  }

  render() {
    if ( this.state.switchPorts.length == 0 ) {
      return (<span>No data</span>);
    }
    var tableWidth = window.innerWidth - 45;
    if ( tableWidth > this.tabbedPanelWidth + 200 ) {
      /* Force side by side layout */
      tableWidth -= this.tabbedPanelWidth; 
    }
    return (
      <Table
        rowsCount={this.state.switchPorts.length}
        rowHeight={this.rowHeight}
        headerHeight={this.headerHeight}
        width={tableWidth}
        height={this.tableHeight}
        onRowClick={this.onRowClick}>
        <Column
          cell={
            <SPPlugCell
              data={this.state.switchPorts}
              detailsIndex={this.detailsIndex}
              field="enabled"
            />
          }
          width={50}
        />
        <Column
          cell={
            <SPTextCell
              data={this.state.switchPorts}
              detailsIndex={this.detailsIndex}
              field="port"
            />
          }
          width={50}
        />
        <Column
          cell={
            <SPTextCell
              data={this.state.switchPorts}
              detailsIndex={this.detailsIndex}
              field="customer"
            />
          }
          width={tableWidth-100}
        />
      </Table>
    );
  }
}

module.exports = SPIndex;
