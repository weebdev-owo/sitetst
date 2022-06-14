import {Text, TextArea, CheckBox, List, FormImage, Space} from '/src/cms/lib/create/primitives'

export function CreateForm(){
    return <>
        <div className={styles["heading"]}>Create Service</div>

        <div className={styles['page-section']}>
            <Text name="url" label="name (https://domain/serivices/'name')" />
            <CheckBox name="enabled" label="enabled (if not enabled service will not appear on website)" />
            <CheckBox name="booking" label="show in booking form (selectable in booking form services if the service is enabled)" />
        </div>

        <div className={styles["sub-heading"]}>Services Data</div>

        <div className={styles["sub-sub-heading"]}>Service Tile</div>
        <div className={styles['page-section']}>
            <Text name="services.tile.order" label="order (where the service is placed on services grid)" />
            <Text name="services.tile.name" label="name" />
            <TextArea name="services.tile.desc" label="description" />
            <FormImage name="services.tile.img" label="background image" styleIn={image_styles['service-tile']}/>
        </div>

        <div className={styles["sub-heading"]}>Service Page Data</div>

        <div className={styles["sub-sub-heading"]}>Section 1: intro</div>
        <div className={styles['page-section']}>
            <Text name="service.intro.name" label="name" />
            <TextArea name="service.intro.desc" label="description" />
            <FormImage name="service.intro.img" label="background image" styleIn={image_styles['fullscreen']}/>
        </div>

        <div className={styles["sub-sub-heading"]}>Section 2: summary (dark background)</div>
        <div className={styles['page-section']}>
            <div className={""}>Statements (part 1)</div>
            <Text name="service.summary.s1" label="statement1" />
            <Text name="service.summary.s2" label="statement2" />
            <Text name="service.summary.s3" label="statement3" />
            <FormImage name="service.summary.img1" label="statement image (image 1)" styleIn={image_styles['summary-1']}/>
            <Space />
            <div className={""}>What (part 2)</div>
            <TextArea name="service.summary.what" label="text" />
            <FormImage name="service.summary.img2" label="image (image 2)" styleIn={image_styles['summary-2']}/>
            <Space />
            <div className={""}>Why (part 3)</div>
            <TextArea name="service.summary.why" label="text" />
            <FormImage name="service.summary.img3" label="image (image 3)" styleIn={image_styles['summary-3']}/>
        </div>

        <div className={styles["sub-sub-heading"]}>Section 3: Our Process</div>
        <div className={styles['page-section']}>
            <TextArea name="service.process.intro" label="intro" />
            <List name={"service.process.steps"} item_template={step} item_label={"Step"}>
                {(i, list_name) => <div>
                    <Text name={`${list_name}.${i}.name`} label={`title`} key={i}/>
                    <TextArea name={`${list_name}.${i}.desc`} label={`description`} key={i}/>
                    <FormImage name={`${list_name}.${i}.img`} label={`image`} styleIn={image_styles['step']} key={i}/>
                </div> }
            </List>
        </div>

        <div className={styles["sub-sub-heading"]}>Section 4: Info/Faq</div>
        <div className={styles['page-section']}>
            <TextArea name="service.faq.intro" label="intro" />
            <List name={"service.faq.items"} item_template={question} item_label={"Question"}>
                {(i, list_name) => <div>
                    <Text name={`${list_name}.${i}.question`} i={i} label={`question`} key={i}/>
                    <TextArea name={`${list_name}.${i}.answer`} i={i} label={`answer`} key={i}/>
                </div>}
            </List>
        </div>

        <div className={styles["submit-section"]}>
            <button type="submit" className={styles["submit"]}>{`Create ${title}`}</button>   
        </div>
    </>
}