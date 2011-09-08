
    create table Amt (
        id integer not null auto_increment,
        alwaysPay bit not null,
        approvalDelay integer not null,
        authSecret varchar(255),
        awsAccessKey varchar(255),
        awsSecretKey varchar(255),
        blackList varchar(255),
        description varchar(255),
        frameHeight integer not null,
        gameDuration integer not null,
        handleSubmit bit not null,
        info varchar(255),
        lifeTime integer not null,
        maxWorkers integer not null,
        minWorkers integer not null,
        reward double precision not null,
        sandbox bit not null,
        title varchar(255),
        primary key (id)
    );

    create table Decision (
        id integer not null auto_increment,
        created datetime not null,
        updated datetime not null,
        cooperation integer not null,
        decisionMaker varchar(255),
        earned integer not null,
        leftNeighbor_id integer not null,
        player_id integer not null,
        rightNeighbor_id integer not null,
        round integer not null,
        game_id integer not null,
        part_id integer not null,
        primary key (id)
    );

    create table Earning (
        id integer not null auto_increment,
        created datetime not null,
        updated datetime not null,
        exchangeRate double precision not null,
        ip varchar(255),
        money double precision not null,
        part1 integer not null,
        part2 integer not null,
        randomSimulationPart integer not null,
        total integer not null,
        turkerId varchar(255),
        game_id integer not null,
        player_id integer not null,
        primary key (id)
    );

    create table Feedback (
        id integer not null auto_increment,
        created datetime not null,
        updated datetime not null,
        instruction integer not null,
        interesting integer not null,
        speed integer not null,
        strategy varchar(255),
        thoughts varchar(255),
        game_id integer not null,
        player_id integer not null,
        primary key (id)
    );

    create table Log (
        id integer not null auto_increment,
        created datetime not null,
        updated datetime not null,
        content longtext not null,
        game_id integer not null,
        primary key (id)
    );

    create table Part (
        id integer not null auto_increment,
        created datetime not null,
        updated datetime not null,
        numberOfCooperation integer not null,
        partName varchar(255) not null,
        partOrder varchar(255),
        playerOrder varchar(255),
        game_id integer not null,
        primary key (id)
    );

    create table Part_Player_players (
        Part_id integer not null,
        players_id integer not null
    );

    create table Pgg (
        id integer not null auto_increment,
        created datetime not null,
        updated datetime not null,
        aiPlayer integer not null,
        costOfCooperation integer not null,
        elapseTime integer not null,
        elicitation bit not null,
        exchangeRate double precision not null,
        fixed bit not null,
        gameStart datetime,
        gid varchar(255) not null,
        globalTimeout integer not null,
        humanPlayer integer not null,
        idleTimeout integer not null,
        indTimeout integer not null,
        minRoundA integer not null,
        minRoundB integer not null,
        orderA varchar(255),
        orderB varchar(255),
        payoff integer not null,
        poe double precision not null,
        regular bit not null,
        seedMoney integer not null,
        status varchar(255),
        primary key (id)
    );

    create table Player (
        id integer not null auto_increment,
        ai bit not null,
        assignmentId varchar(255),
        browserCode varchar(255),
        browserName varchar(255),
        browserVersion longtext,
        clientHeight varchar(255),
        clientWidth varchar(255),
        cookieEnabled varchar(255),
        eliFirstMove integer not null,
        eliRule integer not null,
        finishElicitationTime datetime,
        finishTutorialTime datetime,
        hitId varchar(255),
        ip varchar(255),
        latitude varchar(255),
        location varchar(255),
        longtitude varchar(255),
        name varchar(255) not null,
        note varchar(255),
        pid integer not null,
        platform varchar(255),
        robotName varchar(255),
        startTime datetime,
        status varchar(255) not null,
        stopTime datetime,
        svgSupportedBrowser bit not null,
        turkSubmitTo longtext,
        turkerId varchar(255),
        userAgent longtext,
        game_id integer not null,
        primary key (id)
    );

    create table Track (
        id integer not null auto_increment,
        created datetime not null,
        updated datetime not null,
        content varchar(255),
        trackTime datetime,
        weight integer not null,
        game_id integer not null,
        player_id integer not null,
        primary key (id)
    );

    alter table Decision 
        add index FK259293FC210D3108 (game_id), 
        add constraint FK259293FC210D3108 
        foreign key (game_id) 
        references Pgg (id);

    alter table Decision 
        add index FK259293FC3AC3B7AA (part_id), 
        add constraint FK259293FC3AC3B7AA 
        foreign key (part_id) 
        references Part (id);

    alter table Earning 
        add index FKEE0E1CEA210D3108 (game_id), 
        add constraint FKEE0E1CEA210D3108 
        foreign key (game_id) 
        references Pgg (id);

    alter table Earning 
        add index FKEE0E1CEA958BB4EA (player_id), 
        add constraint FKEE0E1CEA958BB4EA 
        foreign key (player_id) 
        references Player (id);

    alter table Feedback 
        add index FKF8704FA5210D3108 (game_id), 
        add constraint FKF8704FA5210D3108 
        foreign key (game_id) 
        references Pgg (id);

    alter table Feedback 
        add index FKF8704FA5958BB4EA (player_id), 
        add constraint FKF8704FA5958BB4EA 
        foreign key (player_id) 
        references Player (id);

    alter table Log 
        add index FK12B24210D3108 (game_id), 
        add constraint FK12B24210D3108 
        foreign key (game_id) 
        references Pgg (id);

    alter table Part 
        add index FK25D813210D3108 (game_id), 
        add constraint FK25D813210D3108 
        foreign key (game_id) 
        references Pgg (id);

    alter table Part_Player_players 
        add index FK90446C20821AD079 (players_id), 
        add constraint FK90446C20821AD079 
        foreign key (players_id) 
        references Player (id);

    alter table Part_Player_players 
        add index FK90446C203AC3B7AA (Part_id), 
        add constraint FK90446C203AC3B7AA 
        foreign key (Part_id) 
        references Part (id);

    alter table Player 
        add index FK8EA38701210D3108 (game_id), 
        add constraint FK8EA38701210D3108 
        foreign key (game_id) 
        references Pgg (id);

    alter table Track 
        add index FK4D5012B210D3108 (game_id), 
        add constraint FK4D5012B210D3108 
        foreign key (game_id) 
        references Pgg (id);

    alter table Track 
        add index FK4D5012B958BB4EA (player_id), 
        add constraint FK4D5012B958BB4EA 
        foreign key (player_id) 
        references Player (id);
