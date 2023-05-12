import { OutlinedButton, TopBar } from "./CreateStyles";

function CreateTopBar(props) {
  const onGenerateClick = (props.onGenerateClick ??= () => {
    window.alert("On Generate Click");
  });

  return (
    <div className="createPage">
      <TopBar>
        Create New Meditation
        <OutlinedButton onClick={onGenerateClick}>Generate .mp3</OutlinedButton>
      </TopBar>
    </div>
  );
}

export default CreateTopBar;
