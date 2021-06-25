import React from 'react';
import {Carousel, Image} from 'react-bootstrap';
function NewsComponent(props) {
  if(!props.news)
    return null;
  return (
    <Carousel className = {props.className ? props.className : '' /* props.classname || '' */} slide = {false /* Set to true for better appeareance but it generates a warning */}>
      {
        props.news.map((n) => {return (
          <Carousel.Item key = {n.id}>
            <Image
              style = {{'maxHeight': '650px'}}
              className="d-block w-100"
              src = {n.image}
              alt = {n.id}
            />
            <Carousel.Caption>
              <h3>{n.title}</h3>
              <p>{n.subTitle}</p>
            </Carousel.Caption>
          </Carousel.Item>
        );})
      }
    </Carousel>
  );
}
export default NewsComponent;
