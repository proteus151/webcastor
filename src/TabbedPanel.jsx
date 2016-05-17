var React = require('react');
var ReactTabs = require('react-tabs');
var Tab = ReactTabs.Tab;
var Tabs = ReactTabs.Tabs;
var TabList = ReactTabs.TabList;
var TabPanel = ReactTabs.TabPanel;
var SPDetails = require('./SPDetails');
var SPStatus = require('./SPStatus');

class TabbedPanel extends React.Component {

  constructor(props) {
    super(props);
    this.onTabSelect = this.onTabSelect.bind(this);
  }

  onTabSelect(index,last) {
    console.log('Selected tab: ' + index + ', Last tab: ' + last);
  }
  
  render() {
    return (
      <Tabs
        onSelect={this.handleSelect}
        selectedIndex={1} >

        <TabList>
          <Tab>Status</Tab>
          <Tab>Configuration</Tab>
        </TabList>

        <TabPanel>
          <SPStatus />
        </TabPanel>
        <TabPanel>
          <SPDetails />
        </TabPanel>

      </Tabs> );
  }
}

module.exports = TabbedPanel;
