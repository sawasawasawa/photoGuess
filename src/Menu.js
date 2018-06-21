export const Menu = (props) => <div>
  <ul>
    {props.images.map(img => <li onClick={() => this.selectImage(img)} key={img}>
      {img}
    </li>)}
  </ul>
</div>