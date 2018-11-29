import * as React from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, Icon } from "semantic-ui-react";

const channels = ["general", "random"];

export const ChannelList = () => {
  return (
    <Menu inverted vertical fixed={"left"}>
      <Menu.Item as={NavLink} to={"/"}>
        home
        <Icon name="home" />
      </Menu.Item>
      <Menu.Item>
        Channels
        <Icon name="list" />
        <Menu.Menu>
          {channels.map(channel => (
            <Menu.Item
              key={channel}
              as={NavLink}
              name={channel}
              to={{ pathname: `/channels/${channel}` }}
            >
              {channel}
            </Menu.Item>
          ))}
        </Menu.Menu>
      </Menu.Item>
    </Menu>
  );
};
